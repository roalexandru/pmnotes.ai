<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRMify - SaaS CRM for Growing Teams</title>
    <style>
        :root {
            --primary: #2563eb;
            --dark: #0f172a;
            --muted: #64748b;
            --light: #f8fafc;
        }
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; color: var(--dark); line-height: 1.6; }
        a { color: inherit; text-decoration: none; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .btn { display: inline-block; background: var(--primary); color: white; padding: 14px 28px; border-radius: 8px; font-weight: 600; }
        header { padding: 20px 0; border-bottom: 1px solid #e2e8f0; }
        header .container { display: flex; justify-content: space-between; align-items: center; }
        nav a { margin-left: 20px; color: var(--muted); }

        .hero { padding: 90px 0; background: var(--light); text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 16px; }
        .hero p { max-width: 640px; margin: 0 auto 32px; color: var(--muted); }

        .section { padding: 70px 0; }
        .grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
        .icon { width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; color: var(--primary); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }

        .pricing { background: #f1f5f9; }
        .price { font-size: 2rem; font-weight: 700; margin: 12px 0; }

        .testimonial { background: white; border-left: 4px solid var(--primary); padding: 20px; border-radius: 8px; }

        footer { padding: 40px 0; text-align: center; color: var(--muted); }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo" aria-label="CRMify">CRMify</div>
            <nav>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Close more deals with a CRM built for modern teams</h1>
            <p>CRMify helps sales teams track pipelines, automate follow-ups, and forecast revenue with confidence.</p>
            <a href="#signup" class="btn">Start Free Trial</a>
        </div>
    </section>

    <section class="section" id="features">
        <div class="container">
            <h2>Features that scale with your team</h2>
            <div class="grid" style="margin-top: 24px;">
                <div class="card">
                    <div class="icon">🚀</div>
                    <h3>Automated Pipelines</h3>
                    <p>Trigger follow-ups and update deal stages based on real activity.</p>
                </div>
                <div class="card">
                    <div class="icon">📊</div>
                    <h3>Real-time Insights</h3>
                    <p>Forecast revenue and performance with live dashboards.</p>
                </div>
                <div class="card">
                    <div class="icon">🤝</div>
                    <h3>Team Collaboration</h3>
                    <p>Share notes, tag teammates, and keep every deal moving forward.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section" id="testimonials">
        <div class="container">
            <h2>Trusted by fast-growing teams</h2>
            <div class="grid" style="margin-top: 24px;">
                <div class="testimonial">
                    <p>“CRMify helped us increase pipeline visibility by 40% in one quarter.”</p>
                    <strong>— Jordan P., Sales Ops</strong>
                </div>
                <div class="testimonial">
                    <p>“We closed more deals by automating follow-ups and staying organized.”</p>
                    <strong>— Priya K., Account Executive</strong>
                </div>
            </div>
        </div>
    </section>

    <section class="section pricing" id="pricing">
        <div class="container">
            <h2>Simple pricing</h2>
            <div class="grid" style="margin-top: 24px;">
                <div class="card">
                    <h3>Starter</h3>
                    <p class="price">$19<span style="font-size: 1rem;">/user</span></p>
                    <p>For small teams getting started with CRM.</p>
                    <a href="#signup" class="btn" style="margin-top: 12px;">Start Free Trial</a>
                </div>
                <div class="card">
                    <h3>Growth</h3>
                    <p class="price">$49<span style="font-size: 1rem;">/user</span></p>
                    <p>Advanced automation and analytics for scaling teams.</p>
                    <a href="#signup" class="btn" style="margin-top: 12px;">Talk to Sales</a>
                </div>
            </div>
        </div>
    </section>

    <footer id="contact">
        <div class="container">
            <p>Questions? Contact sales@crmify.com</p>
        </div>
    </footer>
</body>
</html>
