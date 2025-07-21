const createElement = (tag, cls, html = "") => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html) el.innerHTML = html;
  return el;
};

// skeletons loader
function showContactsSkeleton(count = 6) {
    const container = document.querySelector(".contacts-wrapper");
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeleton = createElement("div", "contact");
        skeleton.innerHTML = `
        <div class="skeleton-icon" style="width: 70px; height: 70px"></div>
        <div class="profile-info">
            <div class="contact-header">
                <div class="skeleton-icon"></div>
                <div class="skeleton-box" style="width: 40%; height: 1.5em;"></div>
            </div>
            <div class="skeleton-box" style="width: 60%; height: 1.5em; margin: 5px 0;"></div>
        </div>
        `;
        container.appendChild(skeleton);
    }
}

// contacts loader
async function loadContacts() {
  showContactsSkeleton(6);

  try {
    const res = await fetch("/static/data/contacts.json");
    const data = await res.json();

    const container = document.querySelector(".contacts-wrapper");

    const loadedContacts = await Promise.all(
      data.map(contact => {
        return new Promise(resolve => {
          const avatar = new Image();
          avatar.src = contact.avatar;
          avatar.className = "avatar";
          avatar.alt = contact.name;

          avatar.onerror = () => {
            avatar.onerror = null;
            avatar.src = "/static/img/avatar.webp";
          };

          const icon = new Image();
          icon.src = contact.icon;
          icon.className = "contact-icon";
          icon.alt = `${contact.name} Icon`;

          icon.onerror = () => {
            icon.onerror = null;
            icon.src = "/static/img/default-icon.webp";
          };

          let loaded = 0;
          const tryResolve = () => {
            loaded++;
            if (loaded === 2) {
              resolve({ contact, avatar, icon });
            }
          };

          avatar.onload = tryResolve;
          avatar.onerror = tryResolve;

          icon.onload = tryResolve;
          icon.onerror = tryResolve;
        });
      })
    );

    container.innerHTML = "";

    loadedContacts.forEach(({ contact, avatar, icon }) => {
      const a = createElement("a", "contact");
      a.href = contact.url;
      a.target = "_blank";

      const info = createElement("div", "profile-info");
      const header = createElement("div", "contact-header");

      const span = document.createElement("span");
      span.textContent = `${contact.name}:`;

      header.appendChild(icon);
      header.appendChild(span);

      const p = document.createElement("p");
      p.textContent = contact.username;

      info.appendChild(header);
      info.appendChild(p);

      a.appendChild(avatar);
      a.appendChild(info);

      container.appendChild(a);
    });
  } catch (err) {
    console.error("[contacts_loader.js] Contacts loading error:", err);
  }
}

// init
document.addEventListener("DOMContentLoaded", loadContacts);