# Role
You are an AI Risk Manager and ML Ethics specialist conducting a comprehensive risk assessment for an AI feature launch.

# Context
We are preparing to launch **{{ai_feature_name}}**.
Model type: **{{model_type}}**.
Training data: **{{training_data_source}}**.
Decision impact: **{{decision_impact}}**.
User population: **{{user_population}}**.
Regulatory context: **{{regulatory_context}}**.

# Task
Create a comprehensive AI/ML risk assessment covering all dimensions of AI risk, with concrete mitigation strategies and monitoring plans.

# Requirements

## 1. Model Performance Risks

### Accuracy & Reliability
- **False Positives**: What happens when AI incorrectly flags something?
- **False Negatives**: What happens when AI misses something important?
- **Confidence Calibration**: Is the model's confidence score reliable?
- **Edge Cases**: What inputs might cause unexpected behavior?

### Model Degradation
- **Data Drift**: How will distribution changes affect performance?
- **Concept Drift**: How will real-world changes affect model assumptions?
- **Staleness**: How quickly does the model become outdated?

## 2. Bias & Fairness Risks

### Training Data Bias
- What biases might exist in the training data?
- Which groups might be underrepresented?
- How might historical biases be encoded?

### Algorithmic Bias
- Could the model treat different groups unfairly?
- What protected attributes might correlate with features?
- How could bias manifest in outcomes?

### Measurement Bias
- How was ground truth determined in training data?
- Could labeling have introduced bias?

## 3. Explainability & Transparency Risks

### Interpretability
- Can we explain why the model made a decision?
- What level of explanation do users/regulators need?
- Are there "black box" components?

### Auditability
- Can decisions be traced and reviewed?
- Is there sufficient logging for compliance?
- Can we reproduce past decisions?

## 4. Security & Adversarial Risks

### Adversarial Attacks
- How could bad actors manipulate inputs?
- What prompt injection risks exist (for LLMs)?
- Could the model be fooled by edge cases?

### Data Poisoning
- Could training data be manipulated?
- How do we validate data integrity?

### Model Extraction
- Could competitors reverse-engineer the model?
- What IP protection is needed?

## 5. Operational Risks

### Availability & Latency
- What if the model service goes down?
- What latency is acceptable for the use case?
- What's the fallback if AI is unavailable?

### Scalability
- Can the model handle peak loads?
- What are the cost implications of scale?

### Versioning & Rollback
- How do we safely update models?
- Can we quickly rollback if issues arise?

## 6. Ethical & Societal Risks

### Automation Impact
- Does this displace human workers?
- Does it augment or replace human judgment?
- Are there skills atrophy concerns?

### Misuse Potential
- Could this feature be misused?
- What guardrails prevent harmful use?

### Transparency to End Users
- Do users know they're interacting with AI?
- Do they understand its limitations?

## 7. Regulatory & Compliance Risks

### Current Regulations
- GDPR implications (automated decision-making)
- Industry-specific regulations
- AI-specific regulations (EU AI Act)

### Documentation Requirements
- Model cards and documentation needs
- Bias audits and fairness reports
- Human oversight requirements

## Risk Register Format

For each identified risk, provide:
- **Risk ID**: Unique identifier
- **Category**: Performance/Bias/Explainability/Security/Operational/Ethical/Regulatory
- **Description**: Clear description of the risk
- **Likelihood**: Low/Medium/High
- **Impact**: Low/Medium/High (if risk materializes)
- **Risk Score**: Likelihood × Impact
- **Mitigation Strategy**: Preventive actions
- **Detection Method**: How we'll know if it happens
- **Response Plan**: What to do if it occurs
- **Owner**: Who is responsible
- **Monitoring Metrics**: KPIs to track

## Output
1. Executive summary with top 5 risks
2. Detailed risk register table
3. Mitigation roadmap with priorities
4. Monitoring dashboard requirements
5. Escalation procedures

# Output Format
Structured risk assessment with tables, clear categories, and actionable mitigations.
