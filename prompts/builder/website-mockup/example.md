<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS CRM - Grow Your Business</title>
    <style>
        :root {
            --primary: #2563eb;
            --dark: #1e293b;
            --light: #f8fafc;
        }
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; color: var(--dark); line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Header */
        header { padding: 20px 0; border-bottom: 1px solid #e2e8f0; }
        header .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-weight: 900; font-size: 1.5rem; color: var(--primary); }
        nav a { text-decoration: none; color: var(--dark); margin-left: 20px; font-weight: 500; }
        
        /* Hero */
        .hero { text-align: center; padding: 100px 0; background-color: var(--light); }
        .hero h1 { font-size: 3.5rem; margin-bottom: 20px; letter-spacing: -0.025em; }
        .hero p { font-size: 1.25rem; color: #64748b; max-width: 600px; margin: 0 auto 40px; }
        .btn { display: inline-block; background: var(--primary); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }

        /* Features */
        .features { padding: 80px 0; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
        .feature-card { padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; transition: transform 0.2s; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .icon { width: 50px; height: 50px; background: #dbeafe; color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.5rem; }
    </style>
</head>
<body>

    <header>
        <div class="container">
            <div class="logo">CRMify</div>
            <nav>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#login">Login</a>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Close more deals, <br>with less effort.</h1>
            <p>The intelligent CRM built for modern sales teams. Automate outreach, track pipelines, and forecast with confidence.</p>
            <a href="#signup" class="btn">Start Free Trial</a>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="icon">🚀</div>
                    <h3>Automated Pipelines</h3>
                    <p>Stop manual data entry. Our AI updates deal stages automatically based on email activity.</p>
                </div>
                <div class="feature-card">
                    <div class="icon">📊</div>
                    <h3>Smart Analytics</h3>
                    <p>Real-time dashboards give you instant visibility into team performance and revenue forecasts.</p>
                </div>
                <div class="feature-card">
                    <div class="icon">🤝</div>
                    <h3>Team Collaboration</h3>
                    <p>Share notes, tag teammates, and close deals together in a single shared workspace.</p>
                </div>
            </div>
        </div>
    </section>

</body>
</html>
