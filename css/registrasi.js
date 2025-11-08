document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const requiredFields = ['nama-toko', 'deskripsi', 'whatsapp', 'alamat'];
    const fileInput = document.getElementById('avatar-file-input');
    const avatarPreview = document.getElementById('avatar-preview');
    const btnSubmit = document.querySelector('.btn-submit');
    
    // Elemen Dropdown Baru
    const accountToggle = document.getElementById('account-dropdown-toggle');
    const dropdownMenu = document.getElementById('account-dropdown-menu');
    const dropdownStoreName = document.getElementById('dropdown-store-name');

    let avatarBase64 = ''; 

    // Fungsi Validasi & Error (Tidak Diubah)
    function showError(fieldId, message) {
        const inputGroup = document.getElementById('group-' + fieldId);
        const errorMessage = inputGroup.querySelector('.error-message');
        if (inputGroup) inputGroup.classList.add('error');
        if (errorMessage) errorMessage.textContent = message || `${fieldId.replace('-', ' ')} wajib diisi.`;
    }
    function clearError(fieldId) {
        const inputGroup = document.getElementById('group-' + fieldId);
        if (inputGroup) inputGroup.classList.remove('error');
    }

    // Logika Uploader Avatar (Tidak Diubah)
    document.getElementById('btn-pilih-gambar').addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarBase64 = e.target.result; // Simpan Base64 string
                avatarPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = avatarBase64;
                img.alt = 'Avatar Toko Preview';
                avatarPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            avatarBase64 = '';
            avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
        }
    });

    // Aksi saat form registrasi disubmit (Tidak Diubah)
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        let isValid = true;
        
        // 1. Validasi
        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input.value.trim() === '') {
                showError(fieldId);
                isValid = false;
            } else {
                clearError(fieldId);
            }
        });

        // 2. Jika Valid, Simpan dan Pindah
        if (isValid) {
            let existingData = JSON.parse(localStorage.getItem('lokamart_store_data') || '{}');
            
            const storeData = {
                namaToko: document.getElementById('nama-toko').value.trim(),
                deskripsi: document.getElementById('deskripsi').value.trim(),
                whatsapp: document.getElementById('whatsapp').value.trim(),
                alamat: document.getElementById('alamat').value.trim(),
                // Gunakan gambar baru jika ada
                avatar: avatarBase64 || existingData.avatar || '', 
                // Catat tanggal terdaftar hanya jika belum pernah ada
                terdaftar: existingData.terdaftar || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            };

            // Simpan data toko ke localStorage
            localStorage.setItem('lokamart_store_data', JSON.stringify(storeData));

            alert(`Registrasi Toko "${storeData.namaToko}" Berhasil! Anda akan diarahkan ke Dashboard Toko.`);
            
            // Arahkan ke halaman Dashboard
            window.location.href = 'Dasboard toko.html'; 
        } else {
            alert('Mohon lengkapi semua kolom yang wajib diisi.');
        }
    });

    // LOGIKA MUAT DATA & UPDATE NAMA AKUN DI DROPDOWN
    function loadStoreDataToForm() {
        const dataString = localStorage.getItem('lokamart_store_data');
        const data = dataString ? JSON.parse(dataString) : null;

        if (data && data.namaToko) {
            // Mengisi form
            document.getElementById('nama-toko').value = data.namaToko || '';
            document.getElementById('deskripsi').value = data.deskripsi || '';
            document.getElementById('whatsapp').value = data.whatsapp || '';
            document.getElementById('alamat').value = data.alamat || '';
            
            // >>> FOKUS: UPDATE NAMA TOKO DI DROPDOWN <<<
            if (dropdownStoreName) {
                dropdownStoreName.textContent = data.namaToko;
            }
            
            // Update UI untuk mode edit
            document.querySelector('.form-container h1').textContent = `Edit Profil Toko ${data.namaToko}`;
            if(btnSubmit) btnSubmit.textContent = 'Simpan Perubahan';
            document.title = 'Edit Profil Toko | LokaMart';
            
            if (data.avatar) {
                avatarBase64 = data.avatar; 
                avatarPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = data.avatar;
                img.alt = 'Avatar Toko Preview';
                avatarPreview.appendChild(img);
            }
        }
    }
    
    // --- LOGIKA DROPDOWN AKUN BARU ---
    if(accountToggle && dropdownMenu) {
        accountToggle.addEventListener('click', function(e) {
            e.preventDefault();
            // Toggle tampilan dropdown
            const isVisible = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isVisible ? 'none' : 'block';
        });

        // Sembunyikan dropdown saat klik di luar
        document.addEventListener('click', function(e) {
            // Cek jika klik bukan di dalam dropdown-account (tombol atau menu)
            const dropdownContainer = document.querySelector('.dropdown-account');
            if (dropdownContainer && !dropdownContainer.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // Tambahkan Logika Keluar (Contoh)
    const logoutButton = document.getElementById('logout-button');
    if(logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Hapus data toko
            localStorage.removeItem('lokamart_store_data');
            alert('Anda telah keluar dari akun toko.');
            window.location.reload(); // Muat ulang halaman
        });
    }
    
    // Panggil saat halaman dimuat
    loadStoreDataToForm();

    // Logika Pencarian
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query !== "") {
                window.location.href = `daftar.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
});