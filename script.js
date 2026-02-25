document.addEventListener('DOMContentLoaded', async () => {
    const linksContainer = document.getElementById('links-container');
    const userName = document.getElementById('user-name');
    const userBio = document.getElementById('user-bio');
    const profileImg = document.getElementById('profile-img');

    const renderData = (data) => {
        userName.textContent = data.name;
        userBio.textContent = data.bio;
        if (data.profileImage) {
            profileImg.src = data.profileImage;
        }

        // Add Contact / Quick Actions Section
        if (data.contact) {
            const contactSection = document.createElement('div');
            contactSection.className = 'quick-actions';
            contactSection.innerHTML = `
                <a href="tel:+91${data.contact.phone}" class="action-btn call-btn">
                    <i class="fas fa-phone"></i>
                    <span>Call Now</span>
                </a>
                <button class="action-btn save-btn" id="save-contact">
                    <i class="fas fa-user-plus"></i>
                    <span>Save Contact</span>
                </button>
            `;
            linksContainer.before(contactSection);

            document.getElementById('save-contact').addEventListener('click', () => {
                const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.contact.name}
ORG:${data.contact.company}
TEL;TYPE=CELL:${data.contact.phone}
END:VCARD`;
                const blob = new Blob([vcard], { type: 'text/vcard' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${data.contact.name}.vcf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }

        linksContainer.innerHTML = ''; // Clear loading state
        data.links.forEach((link, index) => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.className = 'link-card';
            linkElement.style.animationDelay = `${(index + 1) * 0.1}s`;

            linkElement.innerHTML = `
                <i class="${link.icon}"></i>
                <span>${link.title}</span>
                <i class="fas fa-chevron-right arrow"></i>
            `;

            linksContainer.appendChild(linkElement);
        });
    };

    try {
        const response = await fetch('links.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.warn('Fetch failed, using local data.js fallback:', error);
        if (typeof nfcData !== 'undefined') {
            renderData(nfcData);
        } else {
            userName.textContent = "Error Loading Profile";
            userBio.textContent = "Please ensure data.js or links.json exists.";
        }
    }
});
