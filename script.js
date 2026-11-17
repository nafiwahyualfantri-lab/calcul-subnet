function renderVlsmTable(currentNetInt, prefix, blockSize) {
    const tableBody = document.getElementById('vlsmTableBody'); // Pastikan ID sesuai dengan tbody HTML Anda
    const rowsPerPage = 8; // Menampilkan 8 blok per halaman tetap

    // Hitung indeks global blok saat ini
    const currentBlockIndex = Math.floor(currentNetInt / blockSize);

    // Tentukan indeks awal halaman agar posisi baris AKTIF berpindah secara dinamis (baris 1 s/d 8)
    const pageStartBlockIndex = Math.floor(currentBlockIndex / rowsPerPage) * rowsPerPage;

    let html = '';

    for (let i = 0; i < rowsPerPage; i++) {
        const blockIndex = pageStartBlockIndex + i;
        const netInt = (blockIndex * blockSize) >>> 0;

        // Hentikan jika melebihi batas maksimal IPv4 (255.255.255.255)
        if (netInt > 0xFFFFFFFF || (blockIndex * blockSize) > 0xFFFFFFFF) break;

        const broadInt = (netInt + blockSize - 1) >>> 0;
        const isCurrent = (netInt === currentNetInt);

        const netStr = intToIp(netInt);
        const broadStr = intToIp(broadInt);

        let rangeStr = '-';
        if (prefix === 32) {
            rangeStr = netStr;
        } else if (prefix === 31) {
            rangeStr = `${netStr} - ${broadStr}`;
        } else {
            rangeStr = `${intToIp((netInt + 1) >>> 0)} - ${intToIp((broadInt - 1) >>> 0)}`;
        }

        // Styling baris yang berpindah sesuai blok aktif
        const rowClass = isCurrent
            ? 'bg-cyan-500/15 border-l-4 border-cyan-400 transition-all duration-200'
            : 'hover:bg-slate-800/60 border-l-4 border-transparent transition-all duration-200';

        const badgeOrNumber = isCurrent
            ? `<span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-400 text-slate-950 rounded">AKTIF</span>`
            : `<span class="text-slate-500 mono text-xs">#${blockIndex + 1}</span>`;

        html += `
            <tr class="${rowClass} border-b border-slate-800/80">
                <td class="py-3 px-4">${badgeOrNumber}</td>
                <td class="py-3 px-4 mono font-semibold ${isCurrent ? 'text-cyan-300' : 'text-slate-200'}">
                    ${netStr}/${prefix}
                </td>
                <td class="py-3 px-4 mono text-emerald-400 text-xs md:text-sm">
                    ${rangeStr}
                </td>
                <td class="py-3 px-4 mono text-rose-400 text-xs md:text-sm">
                    ${broadStr}
                </td>
                <td class="py-3 px-4 text-right">
                    <button onclick="selectSubnet('${netStr}')" 
                        class="px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${isCurrent
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }">
                        ${isCurrent ? 'Terpilih' : 'Pilih'}
                    </button>
                </td>
            </tr>
        `;
    }

    tableBody.innerHTML = html;
}

// Fungsi saat tombol "Pilih" diklik
function selectSubnet(newNetworkIp) {
    const ipInput = document.getElementById('ipInput');
    ipInput.value = newNetworkIp;
    // Panggil kembali fungsi kalkulasi utama Anda
    calculateSubnet();
}