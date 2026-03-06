(function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    const RARITY_COLORS = {
        empty:     [58,  100, 180],
        common:    [188, 128,  52],
        rare:      [208, 209, 216],
        epic:      [224, 191,   9],
        legendary: [79,  255, 240],
        mythic:    [183, 158, 247],
        event:     [147, 220,  98],
    };

    const COMMON_BEES    = new Set(['BA']);
    const RARE_BEES      = new Set(['BO','BR','BU','CO','HA','LO','RA','RAS','ST']);
    const EPIC_BEES      = new Set(['BUB','BUC','COM','DE','EX','FI','FR','HO','RAG','RI','SH']);
    const LEGENDARY_BEES = new Set(['BAB','CA','DEM','DI','LI','MU','NI','SHY']);
    const MYTHIC_BEES    = new Set(['BUO','FU','PR','SP','TA','VE']);
    const EVENT_BEES     = new Set(['BE','COB','CR','FE','GU','PH','PU','TAB','VI','WI','DIG']);

    function getRarity(code) {
        if (!code || code === 'U') return 'empty';
        const u = code.toUpperCase();
        if (COMMON_BEES.has(u))    return 'common';
        if (RARE_BEES.has(u))      return 'rare';
        if (EPIC_BEES.has(u))      return 'epic';
        if (LEGENDARY_BEES.has(u)) return 'legendary';
        if (MYTHIC_BEES.has(u))    return 'mythic';
        if (EVENT_BEES.has(u))     return 'event';
        return 'empty';
    }

    let colorPool   = [[58, 100, 180]];
    let hasGifted   = false;
    let targetCount = 15;

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x  = Math.random() * canvas.width;
            this.y  = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 20;
            this.vy = -(0.2 + Math.random() * 0.45);
            this.vx = (Math.random() - 0.5) * 0.15;
            this.sparkle = hasGifted && Math.random() < 0.15;
            if (this.sparkle) {
                this.size    = 1 + Math.random() * 1.5;
                this.vy      = -(0.5 + Math.random() * 0.6);
                this.opacity = 0.35 + Math.random() * 0.35;
            } else {
                this.size    = 1.5 + Math.random() * 3;
                this.opacity = 0.1 + Math.random() * 0.25;
            }
            this.opDir   = Math.random() < 0.5 ? 1 : -1;
            this.opSpeed = 0.002 + Math.random() * 0.003;
            const base = colorPool[Math.floor(Math.random() * colorPool.length)];
            this.r = base[0];
            this.g = base[1];
            this.b = base[2];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.opSpeed * this.opDir;
            if (this.opacity > 0.45 || this.opacity < 0.05) this.opDir *= -1;
            if (this.y < -10)              this.reset();
            if (this.x < -5)               this.x = canvas.width + 5;
            if (this.x > canvas.width + 5) this.x = -5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.opacity.toFixed(2)})`;
            ctx.fill();
            if (this.sparkle) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${(this.opacity * 0.2).toFixed(2)})`;
                ctx.fill();
            }
        }
    }

    let particles = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 15; i++) particles.push(new Particle());

    function animate() {
        // Draw gradient background on the canvas (covers body transparent gap)
        const grad = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height);
        grad.addColorStop(0, '#0C1626');
        grad.addColorStop(1, '#050722');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Maintain target particle count
        while (particles.length < targetCount) particles.push(new Particle());
        if (particles.length > targetCount)    particles.length = targetCount;

        for (const p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(animate);
    }
    animate();

    window.updateParticles = function (hive) {
        if (!hive || !hive.slots) {
            colorPool   = [[58, 100, 180]];
            hasGifted   = false;
            targetCount = 15;
            return;
        }

        const counts = {};
        let filled = 0, gifted = 0;
        for (const slot of hive.slots) {
            if (slot === 'U') continue;
            filled++;
            if (slot !== slot.toUpperCase()) gifted++;
            const r = getRarity(slot);
            counts[r] = (counts[r] || 0) + 1;
        }

        hasGifted   = gifted > 0;
        targetCount = Math.min(80, Math.floor(10 + filled * 1.4));

        if (filled === 0) {
            colorPool = [[58, 100, 180]];
        } else {
            colorPool = [];
            for (const [rarity, count] of Object.entries(counts)) {
                const col = RARITY_COLORS[rarity];
                if (col) {
                    for (let i = 0; i < count; i++) colorPool.push(col);
                }
            }
            if (colorPool.length === 0) colorPool = [[58, 100, 180]];
        }

        // Gradually recolor ~30% of existing particles
        for (const p of particles) {
            if (Math.random() < 0.3) {
                const base = colorPool[Math.floor(Math.random() * colorPool.length)];
                p.r       = base[0];
                p.g       = base[1];
                p.b       = base[2];
                p.sparkle = hasGifted && Math.random() < 0.15;
            }
        }
    };
})();
