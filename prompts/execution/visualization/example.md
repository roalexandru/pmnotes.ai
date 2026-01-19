import matplotlib.pyplot as plt

chart_type = "line"
raw_points = "Jan: 100, Feb: 150, Mar: 130, Apr: 170"
highlight = "Feb"

pairs = [item.strip() for item in raw_points.split(",")]
labels = []
values = []
for pair in pairs:
    label, value = pair.split(":")
    labels.append(label.strip())
    values.append(float(value.strip()))

plt.figure(figsize=(6, 4))
if chart_type == "bar":
    plt.bar(labels, values, color="#6BA4FF")
else:
    plt.plot(labels, values, marker="o", color="#1F77B4")

if highlight in labels:
    idx = labels.index(highlight)
    plt.scatter([labels[idx]], [values[idx]], color="red", zorder=3)
    plt.annotate(
        f"{highlight}: {values[idx]:.0f}",
        (labels[idx], values[idx]),
        textcoords="offset points",
        xytext=(0, 8),
        ha="center"
    )

plt.title("KPI Trend")
plt.xlabel("Month")
plt.ylabel("Value")
plt.tight_layout()
plt.savefig("kpi_chart.png")

print(f"Highlighted {highlight} as a key movement in the trend.")

# Sample Output:
# Highlighted Feb as a key movement in the trend.
# (Chart saved to kpi_chart.png)
