const card = document.querySelector('.card');
const orbs = document.querySelectorAll('.orb');
let hovered = false;
let startTime = null;

// Initialize each orb’s movement settings using its data attributes
const orbSettings = Array.from(orbs).map(orb => {
  // Base positions are provided as percentages (0-100)
  const baseX = parseFloat(orb.dataset.baseX) || 50;
  const baseY = parseFloat(orb.dataset.baseY) || 50;
  
  // Set the orb's size using its data-size (in % relative to the card's width)
  const size = orb.dataset.size;
  if (size) {
    orb.style.width = size + '%';
    orb.style.height = size + '%';
  }
  
  // Set the orb's background using its pastel color (via a radial gradient)
  const color = orb.dataset.color;
  if (color) {
    orb.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  }
  
  return {
    amplitude: Math.random() * 3 + 2,       // Amplitude between 2% and 5% offset
    frequency: Math.random() * 0.002 + 0.001, // Frequency factor
    phaseX: Math.random() * Math.PI * 2,      // Random phase offset for X
    phaseY: Math.random() * Math.PI * 2,      // Random phase offset for Y
    offsetX: 0,                             // Current X offset (in percentage)
    offsetY: 0,                             // Current Y offset (in percentage)
    baseX, // Base X position (in %)
    baseY  // Base Y position (in %)
  };
});

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  orbs.forEach((orb, index) => {
    const settings = orbSettings[index];
    
    // Compute the target offset based on a sine/cosine oscillation if hovered;
    // otherwise, target offset is 0 (i.e. the orb returns to its base position)
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    
    if (hovered) {
      targetOffsetX = settings.amplitude * Math.sin(elapsed * settings.frequency + settings.phaseX);
      targetOffsetY = settings.amplitude * Math.cos(elapsed * settings.frequency + settings.phaseY);
    }
    
    // Easing: smoothly interpolate the current offset towards the target offset
    const easeFactor = 0.1; // Adjust this value for a different smoothing effect
    settings.offsetX += (targetOffsetX - settings.offsetX) * easeFactor;
    settings.offsetY += (targetOffsetY - settings.offsetY) * easeFactor;
    
    // Compute the orb's new position by adding the offset (in %) to its base position
    const orbX = settings.baseX + settings.offsetX;
    const orbY = settings.baseY + settings.offsetY;
    
    orb.style.left = orbX + '%';
    orb.style.top = orbY + '%';
  });
  
  requestAnimationFrame(animate);
}

// When the mouse enters the card, start the oscillation; when it leaves, ease back.
card.addEventListener('mouseenter', () => {
  hovered = true;
});
card.addEventListener('mouseleave', () => {
  hovered = false;
});

// Start the animation loop
requestAnimationFrame(animate);