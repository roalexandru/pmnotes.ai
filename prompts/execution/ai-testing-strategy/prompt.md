# Role
You are an ML Quality Assurance specialist designing comprehensive testing strategies for AI/ML features, covering model performance, fairness, robustness, and production validation.

# Context
We are developing a testing strategy for **{{ai_feature_name}}**.
Model type: **{{model_type}}**.
Critical outcomes: **{{critical_outcomes}}**.
User segments: **{{user_segments}}**.
Known edge cases: **{{edge_cases}}**.
Regulatory requirements: **{{regulatory_requirements}}**.

# Task
Create a comprehensive ML testing strategy that goes beyond traditional software testing to address the unique challenges of AI systems: probabilistic outputs, bias, data drift, and adversarial robustness.

# Requirements

## 1. Test Data Strategy

### Training/Test Split
- **Hold-out test set**: Data model has never seen
- **Temporal split**: Recent data for validation
- **Stratified sampling**: Representation across segments
- **Golden test set**: Curated, high-quality examples

### Test Data Requirements
- **Coverage**: All document types, languages, edge cases
- **Labeling quality**: Ground truth validation
- **Size requirements**: Statistically significant samples
- **Refresh cadence**: How often to update test sets

### Synthetic Data
- **When to use**: Edge cases, rare scenarios
- **Generation methods**: Rules-based, generative models
- **Validation**: Human review of synthetic samples

## 2. Model Accuracy Testing

### Overall Accuracy Metrics
- **Accuracy**: % correct predictions
- **Precision/Recall/F1**: Per class and weighted
- **Mean Average Precision**: For ranking/detection
- **Confusion matrix analysis**: Error patterns

### Field-Level Testing
For extraction tasks:
- **Per-field accuracy**: Individual field performance
- **Weighted accuracy**: By field importance
- **Full-document accuracy**: All fields correct

### Regression Testing
- **Baseline comparison**: New vs. previous model
- **Regression threshold**: Acceptable degradation
- **Sliced analysis**: By segment, by time period

## 3. Confidence Calibration Testing

### Calibration Metrics
- **Expected Calibration Error (ECE)**: Confidence vs. accuracy gap
- **Maximum Calibration Error (MCE)**: Worst-case calibration
- **Reliability diagrams**: Visual calibration analysis

### Threshold Testing
- **Accuracy at confidence levels**: Is 90% confidence = 90% accuracy?
- **Coverage vs. accuracy tradeoffs**: Threshold optimization
- **Uncertainty quantification**: Error bar accuracy

## 4. Bias and Fairness Testing

### Fairness Metrics
- **Demographic parity**: Equal positive rates across groups
- **Equalized odds**: Equal TPR/FPR across groups
- **Predictive parity**: Equal precision across groups
- **Individual fairness**: Similar inputs → similar outputs

### Segment Analysis
- **Geographic segments**: Performance by region
- **User segments**: Performance by customer type
- **Input segments**: Performance by document type
- **Language segments**: Performance by language

### Bias Detection
- **Proxy variable analysis**: Features correlated with protected attributes
- **Outcome disparity**: Different error rates for different groups
- **Representation audit**: Training data coverage

## 5. Robustness Testing

### Input Perturbation
- **Noise injection**: Image quality degradation
- **Format variations**: Layout changes, fonts
- **Missing data**: Incomplete inputs
- **Corrupted data**: Partial file corruption

### Adversarial Testing
- **Adversarial examples**: Crafted to fool model
- **Prompt injection**: For LLM components
- **Evasion attacks**: Designed to cause misclassification

### Boundary Testing
- **Edge cases**: Minimum/maximum valid inputs
- **Out-of-distribution**: Inputs unlike training data
- **Corner cases**: Combinations of edge conditions

## 6. Performance Testing

### Latency Testing
- **Benchmarking**: p50, p95, p99 latency
- **Load testing**: Performance under load
- **Stress testing**: Breaking point identification
- **Spike testing**: Response to traffic bursts

### Scalability Testing
- **Horizontal scaling**: Add instances
- **Vertical scaling**: Increase resources
- **Cost efficiency**: $/inference at scale

### Resource Testing
- **Memory usage**: Peak and average
- **GPU utilization**: Inference efficiency
- **Batch processing**: Throughput optimization

## 7. Integration Testing

### API Contract Testing
- **Request validation**: Input schema enforcement
- **Response validation**: Output schema compliance
- **Error handling**: Graceful degradation
- **Timeout behavior**: Fallback mechanisms

### End-to-End Testing
- **Full workflow**: Upload → inference → display
- **User journey testing**: Critical paths
- **Cross-system testing**: Dependencies

### Fallback Testing
- **Service degradation**: Partial failures
- **Complete failure**: Model unavailable
- **Recovery testing**: Restore from failure

## 8. Production Validation

### Shadow Testing
- **A/B comparison**: Model vs. baseline
- **Canary deployment**: Small traffic percentage
- **Blue-green testing**: Parallel environments

### Monitoring Validation
- **Alert testing**: Verify alerts fire correctly
- **Dashboard accuracy**: Metrics correctness
- **Logging completeness**: Required data captured

### Rollback Testing
- **Rollback procedure**: Verify works correctly
- **Data consistency**: No corruption on rollback
- **Recovery time**: Meet RTO requirements

## 9. Compliance Testing

### Regulatory Requirements
- **Data privacy**: PII handling verification
- **Audit trails**: Logging completeness
- **Explainability**: Decision reasoning available

### Documentation Testing
- **Model cards**: Accuracy and completeness
- **Bias reports**: Fairness documentation
- **Limitation disclosure**: User-facing limitations

## 10. Test Automation

### Continuous Testing
- **CI/CD integration**: Tests in pipeline
- **Automated regression**: On every model update
- **Scheduled testing**: Regular validation

### Test Infrastructure
- **Test data management**: Versioning, access
- **Evaluation harness**: Standardized testing
- **Reporting**: Automated metrics tracking

# Output Format
Comprehensive test strategy document with:
1. Test plan by category
2. Test case templates
3. Pass/fail criteria
4. Automation approach
5. Reporting requirements
