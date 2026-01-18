import csv
import math
from collections import defaultdict

INPUT_CSV = "tickets.csv"
OUTPUT_CSV = "summary.csv"

GROUP_BY = "issue_type"
METRIC = "resolution_hours"


def percentile(values, pct):
    if not values:
        return None
    values = sorted(values)
    k = (len(values) - 1) * pct
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return values[int(k)]
    return values[f] + (values[c] - values[f]) * (k - f)


def load_metrics(file_path):
    grouped = defaultdict(list)
    with open(file_path, mode="r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        if GROUP_BY not in reader.fieldnames or METRIC not in reader.fieldnames:
            raise ValueError("Required columns are missing.")

        for row in reader:
            group_value = row.get(GROUP_BY)
            metric_value = row.get(METRIC)
            if not group_value or not metric_value:
                continue
            try:
                grouped[group_value].append(float(metric_value))
            except ValueError:
                continue

    return grouped


def write_summary(grouped, output_path):
    rows = []
    for group, values in grouped.items():
        rows.append({
            GROUP_BY: group,
            "count": len(values),
            "avg": sum(values) / len(values),
            "p90": percentile(values, 0.9)
        })

    rows.sort(key=lambda row: row["count"], reverse=True)

    print("Top 5 groups by volume:")
    for row in rows[:5]:
        print(f"{row[GROUP_BY]} | count={row['count']} | avg={row['avg']:.2f} | p90={row['p90']:.2f}")

    with open(output_path, mode="w", newline="", encoding="utf-8") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=[GROUP_BY, "count", "avg", "p90"])
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    try:
        grouped_metrics = load_metrics(INPUT_CSV)
        write_summary(grouped_metrics, OUTPUT_CSV)
    except FileNotFoundError:
        print(f"Error: File '{INPUT_CSV}' not found.")
    except ValueError as exc:
        print(f"Error: {exc}")
