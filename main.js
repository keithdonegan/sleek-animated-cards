const card = document.querySelector('.card');
const orbs = document.querySelectorAll('.orb');
let hovered = false;
let startTime = null;

// Initialize each orb’s movement settings based on its data attributes
const orbSettings = Array.from(orbs).map(orb => {
  // Read the base position (as a fraction of the card size)
  const baseXFactor = parseFloat(orb.dataset.baseX) || 0.5;
  const baseYFactor = parseFloat(orb.dataset.baseY) || 0.5;
  
  // Set the orb's background based on its data-color
  const color = orb.dataset.color;
  if (color) {
    orb.style.background = `radial-gradient(circle, ${color} 0%, transparent 100%)`; 
  }
  
  return {
    amplitude: Math.random() * 30 + 20,           // amplitude between 20 and 50px
    frequency: Math.random() * 0.001 + 0.001,       // frequency factor
    phaseX: Math.random() * Math.PI * 22,           // random phase offset for X
    phaseY: Math.random() * Math.PI * 22,           // random phase offset for Y
    direction: Math.random() < 0.5 ? 1 : -1,        // randomly alternate spin direction
    offsetX: 0,                                   // current X offset (for easing)
    offsetY: 0,                                   // current Y offset (for easing)
    baseXFactor,                                  // relative horizontal anchor (0 to 1)
    baseYFactor                                   // relative vertical anchor (0 to 1)
  };
});

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  orbs.forEach((orb, index) => {
    const settings = orbSettings[index];
    
    // Calculate target offset if hovered; otherwise, target is zero offset.
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    if (hovered) {
      targetOffsetX = settings.amplitude * Math.sin(elapsed * settings.frequency * settings.direction + settings.phaseX);
      targetOffsetY = settings.amplitude * Math.cos(elapsed * settings.frequency * settings.direction + settings.phaseY);
    }
    
    // Ease the current offset toward the target offset
    const easeFactor = 0.035;
    settings.offsetX += (targetOffsetX - settings.offsetX) * easeFactor;
    settings.offsetY += (targetOffsetY - settings.offsetY) * easeFactor;
    
    // Compute each orb's base position based on the card dimensions and its custom factors
    const cardBaseX = card.clientWidth * settings.baseXFactor;
    const cardBaseY = card.clientHeight * settings.baseYFactor;
    
    // Apply the current offset
    const orbX = cardBaseX + settings.offsetX;
    const orbY = cardBaseY + settings.offsetY;
    
    orb.style.left = orbX + 'px';
    orb.style.top = orbY + 'px';
  });

  requestAnimationFrame(animate);
}

// Toggle the hover state on the card to start/stop the floating effect
card.addEventListener('mouseenter', () => {
  hovered = true;
});
card.addEventListener('mouseleave', () => {
  hovered = false;
});

// Start the animation loop
requestAnimationFrame(animate);
