(function(window){
    function random(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    function bezier(cp, t) {         
        var p1 = cp[0].mul((1 - t) * (1 - t));
        var p2 = cp[1].mul(2 * t * (1 - t));
        var p3 = cp[2].mul(t * t); 
        return p1.add(p2).add(p3);
    }       

    // Ecuación matemática del corazón gigante del árbol
    function inheart(x, y, r) {
        var z = ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) - (x / r) * (x / r) * (y / r) * (y / r) * (y / r);
        return z < 0;
    }

    Point = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Point.prototype = {
        clone: function() {
            return new Point(this.x, this.y);
        },
        add: function(o) {
            p = this.clone();
            p.x += o.x;
            p.y += o.y;
            return p;
        },
        sub: function(o) {
            p = this.clone();
            p.x -= o.x;
            p.y -= o.y;
            return p;
        },
        div: function(n) {
            p = this.clone();
            p.x /= n;
            p.y /= n;
            return p;
        },
        mul: function(n) {
            p = this.clone();
            p.x *= n;
            p.y *= n;
            return p;
        }
    }

    Heart = function() {
        var points = [], x, y, t;
        for (var i = 10; i < 30; i += 0.2) {
            t = i / Math.PI;
            x = 16 * Math.pow(Math.sin(t), 3);
            y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            points.push(new Point(x, y));
        }
        this.points = points;
        this.length = points.length;
    }
    Heart.prototype = {
        get: function(i, scale) {
            return this.points[i].mul(scale || 1);
        }
    }

    // Girasol Romántico y Profesional (Doble capa, luz y semillas doradas)
    function drawSunflower(ctx) {
        ctx.save();
        
        // Base sólida luminosa para tapar cualquier espacio
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFB300";
        ctx.fill();

        // DOBLE CAPA DE PÉTALOS: Crea un efecto realista y muy tupido
        for (var layer = 0; layer < 2; layer++) {
            var isBackLayer = (layer === 0);
            var petalCount = isBackLayer ? 16 : 12; // 16 pétalos atrás, 12 adelante
            var scale = isBackLayer ? 1 : 0.85;
            var offset = isBackLayer ? 0 : (Math.PI / petalCount); // Rotación intercalada

            for (var i = 0; i < petalCount; i++) {
                ctx.save();
                ctx.rotate((i * 2 * Math.PI) / petalCount + offset);
                ctx.scale(scale, scale);
                ctx.beginPath();
                
                // Gradiente espectacular para los pétalos
                var petGrad = ctx.createLinearGradient(0, 0, 0, -24);
                if (isBackLayer) {
                    petGrad.addColorStop(0, "#FF8F00"); // Naranja oscuro en la base
                    petGrad.addColorStop(1, "#FFC107"); // Amarillo en la punta
                } else {
                    petGrad.addColorStop(0, "#FFA000"); // Naranja claro
                    petGrad.addColorStop(1, "#FFF59D"); // Punta amarilla muy brillante y romántica
                }
                
                ctx.fillStyle = petGrad;
                ctx.strokeStyle = "rgba(139, 69, 19, 0.2)"; // Borde sutil
                ctx.lineWidth = 0.5;
                
                // Forma de pétalo orgánica y delicada con curvas Bezier
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(7, -8, 7, -18, 0, -24);
                ctx.bezierCurveTo(-7, -18, -7, -8, 0, 0);
                
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }

        // Centro del girasol degradado (Efecto 3D)
        ctx.beginPath();
        ctx.arc(0, 0, 7.5, 0, 2 * Math.PI);
        var centerGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 7.5);
        centerGrad.addColorStop(0, "#5D4037"); // Centro iluminado
        centerGrad.addColorStop(0.7, "#3E2723");
        centerGrad.addColorStop(1, "#1B0000"); // Borde oscuro
        ctx.fillStyle = centerGrad;
        ctx.fill();

        // Polvo de hadas y semillas (Toque romántico dorado)
        for (var j = 0; j < 14; j++) {
            ctx.beginPath();
            var angle = random(0, 360) * Math.PI / 180;
            var dist = random(0, 60) / 10;
            ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, random(4, 9) / 10, 0, 2 * Math.PI);
            // Algunas semillas son oscuras, otras son chispas de oro
            ctx.fillStyle = (j % 3 === 0) ? "#000000" : "#050505"; 
            ctx.fill();
        }

        ctx.restore();
    }

    Seed = function(tree, point, scale, color) {
        this.tree = tree;
        var scale = scale || 1;
        var color = '#5D4037'; // Marrón elegante para el origen
        this.heart = {
            point  : point,
            scale  : scale,
            color  : color,
            figure : new Heart(),
        }
        this.cirle = {
            point  : point,
            scale  : scale,
            color  : color,
            radius : 5,
        }
    }
    Seed.prototype = {
        draw: function() {
            this.drawHeart();
            this.drawText();
        },
        addPosition: function(x, y) {
            this.cirle.point = this.cirle.point.add(new Point(x, y));
        },
        canMove: function() {
            return this.cirle.point.y < (this.tree.height + 20); 
        },
        move: function(x, y) {
            this.clear();
            this.drawCirle();
            this.addPosition(x, y);
        },
        canScale: function() {
            return this.heart.scale > 0.2;
        },
        setHeartScale: function(scale) {
            this.heart.scale *= scale;
        },
        scale: function(scale) {
            this.clear();
            this.drawCirle();
            this.drawHeart();
            this.setHeartScale(scale);
        },
        drawHeart: function() {
            var ctx = this.tree.ctx, heart = this.heart;
            var point = heart.point, scale = heart.scale;
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            drawSunflower(ctx);
            ctx.restore();
        },
        drawCirle: function() {
            var ctx = this.tree.ctx, cirle = this.cirle;
            var point = cirle.point, color = cirle.color, 
                scale = cirle.scale, radius = cirle.radius;
            ctx.save();
            ctx.fillStyle = color;
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        drawText: function() {
            var ctx = this.tree.ctx, heart = this.heart;
            var point = heart.point, scale = heart.scale;
            ctx.save();
            ctx.strokeStyle = "#8D6E63"; // Línea sutil
            ctx.fillStyle = "#4E342E";  // Texto chocolate elegante
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            ctx.moveTo(0, 0);
            ctx.lineTo(15, 15);
            ctx.lineTo(85, 15);
            ctx.stroke();
            ctx.moveTo(0, 0);
            ctx.scale(0.75, 0.75);
            // Fuente romántica, cursiva si está disponible, si no Georgia serif
            ctx.font = "italic bold 15px Georgia, 'Times New Roman', serif"; 
            ctx.fillText("  Click Aquí", 23, 16);
            ctx.restore();
        },
        clear: function() {
            var ctx = this.tree.ctx, cirle = this.cirle;
            var point = cirle.point, scale = cirle.scale, radius = 26;
            var w = h = (radius * scale);
            ctx.clearRect(point.x - w, point.y - h, 4 * w, 4 * h);
        },
        hover: function(x, y) {
            var ctx = this.tree.ctx;
            var pixel = ctx.getImageData(x, y, 1, 1);
            return pixel.data[3] == 255
        }
    }

    Footer = function(tree, width, height, speed) {
        this.tree = tree;
        this.point = new Point(tree.seed.heart.point.x, tree.height - height / 2);
        this.width = width;
        this.height = height;
        this.speed = speed || 2;
        this.length = 0;
    }
    Footer.prototype = {
        draw: function() {
            var ctx = this.tree.ctx, point = this.point;
            var len = this.length / 2;
            ctx.save();
            ctx.strokeStyle = '#4E342E'; // Base del suelo a juego con el árbol
            ctx.lineWidth = this.height;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.translate(point.x, point.y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(len, 0);
            ctx.lineTo(-len, 0);
            ctx.stroke();
            ctx.restore();
            if (this.length < this.width) {
                this.length += this.speed;
            }
        }
    }

    Tree = function(canvas, width, height, opt) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.opt = opt || {};
        this.record = {};
             
        this.initSeed();
        this.initFooter();
        this.initBranch();
        this.initBloom();
    }
    Tree.prototype = {
        initSeed: function() {
            var seed = this.opt.seed || {};
            var x = seed.x || this.width / 2;
            var y = seed.y || this.height / 2;
            var point = new Point(x, y);
            var color = '#FFD700'; 
            var scale = seed.scale || 1;
            this.seed = new Seed(this, point, scale, color);
        },
        initFooter: function() {
            var footer = this.opt.footer || {};
            var width = footer.width || this.width;
            var height = footer.height || 5;
            var speed = footer.speed || 2;
            this.footer = new Footer(this, width, height, speed);
        },
        initBranch: function() {
            var branchs = this.opt.branch || []
            this.branchs = [];
            this.addBranchs(branchs);
        },
        initBloom: function() {
            var bloom = this.opt.bloom || {};
            var cache = [], 
                num = 500, // Optimizado: Cantidad ligera para carga ultra rápida y fluida
                width = bloom.width || this.width,
                height = bloom.height || this.height,
                figure = this.seed.heart.figure;
            var r = 240, x, y;
            for (var i = 0; i < num; i++) {
                cache.push(this.createBloom(width, height, r, figure));
            }
            this.blooms = [];
            this.bloomsCache = cache;
        },
        toDataURL: function(type) {
            return this.canvas.toDataURL(type);
        },
        draw: function(k) {
            var s = this, ctx = s.ctx;
            var rec = s.record[k];
            if (!rec) {
                return ;
            }
            var point = rec.point, 
                image = rec.image;
            ctx.save();
            ctx.putImageData(image, point.x, point.y);
            ctx.restore();
        },
        addBranch: function(branch) {
            this.branchs.push(branch);
        },
        addBranchs: function(branchs){
            var s = this, b, p1, p2, p3, r, l, c;
            for (var i = 0; i < branchs.length; i++) {
                b = branchs[i];
                p1 = new Point(b[0], b[1]);
                p2 = new Point(b[2], b[3]);
                p3 = new Point(b[4], b[5]);
                r = b[6];
                l = b[7];
                c = b[8]
                s.addBranch(new Branch(s, p1, p2, p3, r, l, c)); 
            }
        },
        removeBranch: function(branch) {
            var branchs = this.branchs;
            for (var i = 0; i < branchs.length; i++) {
                if (branchs[i] === branch) {
                    branchs.splice(i, 1);
                }
            }
        },
        canGrow: function() {
            return !!this.branchs.length;
        },
        grow: function() {
            var branchs = this.branchs;
            for (var i = 0; i < branchs.length; i++) {
                var branch = branchs[i];
                if (branch) {
                    branch.grow();
                }
            }
        },
        addBloom: function (bloom) {
            this.blooms.push(bloom);
        },
        removeBloom: function (bloom) {
            var blooms = this.blooms;
            for (var i = 0; i < blooms.length; i++) {
                if (blooms[i] === bloom) {
                    blooms.splice(i, 1);
                }
            }
        },
        createBloom: function(width, height, radius, figure, color, alpha, angle, scale, place, speed) {
            var x, y;
            while (true) {
                x = random(20, width - 20);
                y = random(20, height - 20);
                if (inheart(x - width / 2, height - (height - 40) / 2 - y, radius)) {
                    return new Bloom(this, new Point(x, y), figure, color, alpha, angle, scale, place, speed);
                }
            }
        },        
        canFlower: function() {
            return !!this.blooms.length;
        }, 
        flower: function(num) {
            var s = this, blooms = s.bloomsCache.splice(0, num);
            for (var i = 0; i < blooms.length; i++) {
                s.addBloom(blooms[i]);
            }
            blooms = s.blooms;
            for (var j = 0; j < blooms.length; j++) {
                blooms[j].flower();
            }
        },
        snapshot: function(k, x, y, width, height) {
            var ctx = this.ctx;
            var image = ctx.getImageData(x, y, width, height); 
            this.record[k] = {
                image: image,
                point: new Point(x, y),
                width: width,
                height: height
            }
        },
        setSpeed: function(k, speed) {
            this.record[k || "move"].speed = speed;
        },
        move: function(k, x, y) {
            var s = this, ctx = s.ctx;
            var rec = s.record[k || "move"];
            var point = rec.point, 
                image = rec.image,
                speed = rec.speed || 10,
                width = rec.width,
                height = rec.height; 

            i = point.x + speed < x ? point.x + speed : x;
            j = point.y + speed < y ? point.y + speed : y; 

            ctx.save();
            ctx.clearRect(point.x, point.y, width, height);
            ctx.putImageData(image, i, j);
            ctx.restore();
            rec.point = new Point(i, j);
            rec.speed = speed * 0.95;
            if (rec.speed < 2) {
                rec.speed = 2;
            }
            return i < x || j < y;
        },
        jump: function() {
            var s = this, blooms = s.blooms;
            if (blooms.length) {
                for (var i = 0; i < blooms.length; i++) {
                    blooms[i].jump();
                }
            }
            if ((blooms.length && blooms.length < 4) || !blooms.length) {
                var bloom = this.opt.bloom || {},
                    width = bloom.width || this.width,
                    height = bloom.height || this.height,
                    figure = this.seed.heart.figure;
                var r = 240, x, y;
                for (var i = 0; i < random(1, 2); i++) {
                    blooms.push(this.createBloom(width / 2 + width, height, r, figure, null, 1, null, 1, new Point(random(-100,600), 720), random(200,300)));
                }
            }
        }
    }

    Branch = function(tree, point1, point2, point3, radius, length, branchs) {
        this.tree = tree;
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.radius = radius;
        this.length = length || 100; 
        this.len = 0;
        this.t = 1 / (this.length - 1); 
        this.branchs = branchs || [];
    }
    Branch.prototype = {
        grow: function() {
            var s = this, p; 
            if (s.len <= s.length) {
                p = bezier([s.point1, s.point2, s.point3], s.len * s.t);
                s.draw(p);
                s.len += 1;
                s.radius *= 0.97;
            } else {
                s.tree.removeBranch(s);
                s.tree.addBranchs(s.branchs);
            }
        },
        draw: function(p) {
            var s = this;
            var ctx = s.tree.ctx;
            ctx.save();
            ctx.beginPath();                    
            // Tronco y ramas con un tono Caoba cálido y romántico
            ctx.fillStyle = '#5D4037'; 
            ctx.shadowColor = '#3E2723'; 
            ctx.shadowBlur = 4;
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, s.radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    Bloom = function(tree, point, figure, color, alpha, angle, scale, place, speed) {
        this.tree = tree;
        this.point = point; 
        
        this.color = '#FFD700'; 
        this.alpha = 1; 
        
        this.angle = angle || random(0, 360);
        this.scale = scale || 0.1;
        this.place = place;
        this.speed = speed;
        this.figure = figure;
    }
    Bloom.prototype = {
        setFigure: function(figure) {
            this.figure = figure;
        },
        flower: function() {
            var s = this;
            s.draw();
            s.scale += 0.1;
            if (s.scale > 1) {
                s.tree.removeBloom(s);
            }
        },
        draw: function() {
            var s = this, ctx = s.tree.ctx;
            ctx.save();
            ctx.globalAlpha = s.alpha; 
            ctx.translate(s.point.x, s.point.y);
            ctx.scale(s.scale, s.scale);
            ctx.rotate(s.angle);
            
            drawSunflower(ctx);
            
            ctx.restore();
        },
        jump: function() {
            var s = this, height = s.tree.height;
            if (s.point.x < -20 || s.point.y > height + 20) {
                s.tree.removeBloom(s);
            } else {
                s.draw();
                
                // EFECTO MÁGICO: Ahora las flores se balancean suavemente mientras caen (como hojas al viento)
                s.point.x += Math.sin(s.angle * 2) * 1.5; 
                s.point = s.place.sub(s.point).div(s.speed * 1.1).add(s.point);
                s.angle += 0.03; // Rotación más suave y lenta
                s.speed -= 1;
            }
        }
    }

    window.random = random;
    window.bezier = bezier;
    window.Point = Point;
    window.Tree = Tree;
})(window);