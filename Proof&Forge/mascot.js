// mascot.js - Video Mascot Implementation (V3 - GSAP Tween Optimized)

console.log("Initializing Video Mascot (GSAP Tween)...");

gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('mascot-video');

// Ensure video metadata is loaded before setting up scroll trigger
if (video.readyState >= 1) {
    initScrollVideo();
} else {
    video.addEventListener('loadedmetadata', initScrollVideo);
}

function initScrollVideo() {
    console.log("Video metadata loaded. Duration:", video.duration);

    // Ensure video is paused
    video.pause();
    video.currentTime = 0;

    // Use GSAP to animate the Time itself
    // This creates a "spring" effect where the video lags slightly behind the scroll
    // effectively smoothing out the jumps between keyframes.

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // GSAP's built-in smoothing (1 second lag)
            onUpdate: (self) => {
                // We rely on 'scrub' for smoothing the timeline progress,
                // but direct video control can benefit from an additional tween if scrub isn't enough.
                // However, simply mapping specific scroll positions to video timestamps is often cleanest.
            }
        }
    });

    // We animate the 'currentTime' property of the video object
    // from 0 to duration over the course of the timeline
    tl.fromTo(video,
        { currentTime: 0 },
        {
            currentTime: video.duration || 10,
            ease: "none", // Linear map between scroll and time
            duration: video.duration // Duration in the timeline (doesn't matter much for scrub)
        }
    );
}

// Handle resize to ensure object-fit behaves
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
