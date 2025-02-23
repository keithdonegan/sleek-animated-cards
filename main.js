const cards = document.querySelectorAll('.card');

cards.forEach(card => {
	const orbs = card.querySelectorAll('.orb');
  	let hovered = false;
  	let startTime = null;

  	// Initialize each orb’s movement settings based on its data attributes
  	const orbSettings = Array.from(orbs).map(orb => {
    	const baseXFactor = parseFloat(orb.dataset.baseX) || 0.5;
    	const baseYFactor = parseFloat(orb.dataset.baseY) || 0.5;

    	const baseWidth = orb.dataset.width;
    	const baseHeight = orb.dataset.height;

		if (baseWidth && baseHeight) {
			orb.style.width = baseWidth + 'px';
			orb.style.height = baseHeight + 'px';
		}

    	// Set the orb's background based on its data-color
    	const color = orb.dataset.color;

    	if (color) {
      		orb.style.background = `radial-gradient(circle, ${color} 0%, transparent 100%)`;
   	 	}

		return {
			amplitude: Math.random() * 120 + 50,
			frequency: Math.random() * 0.001 + 0.001,
			phaseX: Math.random() * Math.PI * 22,
			phaseY: Math.random() * Math.PI * 22,
			direction: Math.random() < 0.5 ? 1 : -1,
			offsetX: 10,
			offsetY: 10,
			baseXFactor,
			baseYFactor
		};
	});

	function animate(timestamp) {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;

		orbs.forEach((orb, index) => {
			const settings = orbSettings[index];

			let targetOffsetX = 0;
			let targetOffsetY = 0;

			if (hovered) {
				targetOffsetX = settings.amplitude * Math.sin(elapsed * settings.frequency * settings.direction + settings.phaseX);
				targetOffsetY = settings.amplitude * Math.cos(elapsed * settings.frequency * settings.direction + settings.phaseY);
			}

			const easeFactor = 0.035;
			settings.offsetX += (targetOffsetX - settings.offsetX) * easeFactor;
			settings.offsetY += (targetOffsetY - settings.offsetY) * easeFactor;

			const cardBaseX = card.clientWidth * settings.baseXFactor;
			const cardBaseY = card.clientHeight * settings.baseYFactor;

			const orbX = cardBaseX + settings.offsetX;
			const orbY = cardBaseY + settings.offsetY;

			orb.style.left = orbX + 'px';
			orb.style.top = orbY + 'px';
		});

		requestAnimationFrame(animate);
	}

	card.addEventListener('mouseenter', () => {
		hovered = true;
	});

	card.addEventListener('mouseleave', () => {
		hovered = false;
	});

	requestAnimationFrame(animate);
});