// State Management
const state = {
    connected: false,
    address: null,
    skill: '',
    signature: null,
    provider: null,
    signer: null
};

// DOM Elements
const elements = {
    connectBtn: document.getElementById('connectWalletBtn'),
    walletStatus: document.getElementById('walletStatus'),
    walletAddressDisplay: document.getElementById('walletAddressDisplay'),
    statusDot: document.querySelector('.status-dot'),

    // Inputs & Areas
    skillInput: document.getElementById('skillInput'),
    signBtn: document.getElementById('signBtn'),
    signingUI: document.getElementById('signing-ui'),
    loadingUI: document.getElementById('loading-ui'),

    // Badge Area
    badgeSection: document.getElementById('badge-section'),
    proofBadge: document.getElementById('proofBadge'),
    badgeActions: document.getElementById('badgeActions'),

    // Badge Elements
    badgeSkill: document.getElementById('badgeSkill'),
    badgeAddress: document.getElementById('badgeAddress'),
    badgeSignature: document.getElementById('badgeSignature'),
    badgeDate: document.getElementById('badgeDate'),

    downloadBtn: document.getElementById('downloadBtn'),
    resetBtn: document.getElementById('resetBtn')
};

// Helper Functions
const shortenAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

const updateUI = () => {
    // Wallet Status
    if (state.connected) {
        elements.connectBtn.innerText = "Connected";
        elements.connectBtn.disabled = true;
        elements.walletAddressDisplay.innerText = shortenAddress(state.address);
        elements.statusDot.classList.add('connected');
        elements.walletStatus.classList.add('connected');
        elements.walletStatus.title = "Click to copy address";

        // Auto-scroll to Create Section if newly connected and no signature
        if (!state.signature) {
            gsap.to(window, { duration: 1, scrollTo: "#create-section" });
        }
    } else {
        elements.connectBtn.innerText = "Connect Wallet";
        elements.connectBtn.disabled = false;
        elements.walletAddressDisplay.innerText = "Not Connected";
        elements.statusDot.classList.remove('connected');
        elements.walletStatus.classList.remove('connected');
        elements.walletStatus.title = "";
    }
};

// Wallet Connection
const connectWallet = async () => {
    if (window.ethereum) {
        try {
            state.provider = new ethers.providers.Web3Provider(window.ethereum);
            await state.provider.send("eth_requestAccounts", []);
            state.signer = state.provider.getSigner();
            state.address = await state.signer.getAddress();
            state.connected = true;
            updateUI();
        } catch (error) {
            console.error("Connection failed", error);
            alert("Failed to connect wallet.");
        }
    } else {
        alert("Please install MetaMask!");
    }
};

// Signing Logic
const signMessage = async () => {
    state.skill = elements.skillInput.value.trim();
    if (!state.skill) {
        alert("Please enter a skill.");
        return;
    }

    if (!state.connected) {
        alert("Please connect your wallet first.");
        connectWallet();
        return;
    }

    // Update UI to Loading
    elements.signingUI.classList.add('hidden');
    elements.loadingUI.classList.remove('hidden');

    try {
        const message = `I hereby verify that I possess the following skill: ${state.skill}\n\nTimestamp: ${Date.now()}\n\nSigned by: ${state.address}`;
        state.signature = await state.signer.signMessage(message);

        // Success
        elements.loadingUI.classList.add('hidden');
        elements.signingUI.classList.remove('hidden'); // Reset for next time

        // Reveal Badge
        elements.proofBadge.classList.remove('hidden');
        elements.badgeActions.classList.remove('hidden');

        updateBadgeUI();

        // Scroll to Badge
        gsap.to(window, { duration: 1.5, scrollTo: "#badge-section" });

    } catch (error) {
        console.error("Signing failed", error);
        elements.loadingUI.classList.add('hidden');
        elements.signingUI.classList.remove('hidden');
        alert("Signing rejected or failed.");
    }
};

const updateBadgeUI = () => {
    elements.badgeSkill.innerText = state.skill;
    elements.badgeAddress.innerText = state.address;
    elements.badgeSignature.innerText = state.signature.substring(0, 30) + "...";
    elements.badgeDate.innerText = new Date().toLocaleDateString();
};

const resetApp = () => {
    state.skill = '';
    state.signature = null;
    elements.skillInput.value = '';

    // Hide Badge
    elements.proofBadge.classList.add('hidden');
    elements.badgeActions.classList.add('hidden');

    // Scroll to Top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const downloadBadge = () => {
    const originalBadge = document.getElementById('proofBadge');

    // Create a clone to render in isolation to avoid artifacts
    const clone = originalBadge.cloneNode(true);

    // Apply specific styles to the clone to ensure clean capture
    clone.style.position = 'fixed';
    clone.style.top = '-9999px'; // Move off-screen
    clone.style.left = '0';
    clone.style.zIndex = '9999';
    clone.style.width = '400px'; // Enforce fixed width for consistency
    clone.style.background = 'linear-gradient(145deg, #1e272e, #2d3436)'; // Enforce solid background
    clone.style.borderRadius = '16px'; // Ensure border radius matches
    clone.style.color = '#ffffff';
    // Inject Logo into the clone for the download version
    const logoImg = document.createElement('img');
    logoImg.src = 'logo_p&f.png';
    logoImg.style.position = 'absolute';
    logoImg.style.top = '50%';
    logoImg.style.right = '30px';
    logoImg.style.transform = 'translateY(-50%)';
    logoImg.style.width = '60px'; // Minimized size
    logoImg.style.height = 'auto';
    logoImg.style.opacity = '0.8'; // Subtle watermark effect
    clone.appendChild(logoImg);

    clone.classList.remove('hidden');

    document.body.appendChild(clone);

    html2canvas(clone, {
        backgroundColor: null, // Let the clone's background handle it
        scale: 3, // High quality
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `proof-forge-${state.skill.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Cleanup
        document.body.removeChild(clone);
    }).catch(err => {
        console.error("Badge generation failed:", err);
        alert("Failed to generate badge image.");
        if (document.body.contains(clone)) {
            document.body.removeChild(clone);
        }
    });
};

const copyAddress = () => {
    if (state.connected && state.address) {
        navigator.clipboard.writeText(state.address).then(() => {
            const originalText = elements.walletAddressDisplay.innerText;
            elements.walletAddressDisplay.innerText = "Copied!";
            setTimeout(() => {
                elements.walletAddressDisplay.innerText = originalText;
            }, 1000);
        });
    }
};

// Event Listeners
if (elements.connectBtn) elements.connectBtn.addEventListener('click', connectWallet);
if (elements.signBtn) elements.signBtn.addEventListener('click', signMessage);
if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetApp);
if (elements.downloadBtn) elements.downloadBtn.addEventListener('click', downloadBadge);
if (elements.walletStatus) elements.walletStatus.addEventListener('click', copyAddress);

// Check if already connected
const checkConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
        await connectWallet();
    }
};

checkConnection();
