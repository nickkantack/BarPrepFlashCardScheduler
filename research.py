
import math
import matplotlib.pyplot as plt
import numpy

def main():

    basic_calculations()

    print("Done")


def basic_calculations():
    N = 379
    D = 37
    phi = 0.1

    rs = numpy.linspace(0.1, 0.7, 100)
    ms = [get_m(N, D, phi, r) for r in rs]
    times_seen_before_bar = [math.log(D) / math.log(1 / r) for r in rs]
    linear = [3 * t + 15 for t in times_seen_before_bar]

    plt.plot(times_seen_before_bar, ms, label="Exact")
    plt.plot(times_seen_before_bar, linear, label="Linear approximation")
    plt.xlabel("Times card seen before exam")
    plt.ylabel("Cards studied per day")
    plt.title("Cards per day required based on desire for review")
    plt.show()


def get_m(N, D, phi, r):
    C = N / D
    # print(f"Every time I success with a card I go {1 / r} times longer before reviewing it again")
    # print(f"I must introduce {C} new cards per day to learn all cards")
    # print(f"Each card will repeat at most {math.floor(math.log(D) / math.log(1 / r))} times if I keep getting it right")
    psi = 2 -  (1 - phi)**math.floor(math.log(D) / math.log(1 / r))
    # print(f"Due to forgetfulness I expect to have a virtual card load of {psi} times the real card load")
    m = C / (1 - r) + C
    # print(f"I will be learning {C} new cards each day and reviewing {C / (1 - r)} old cards each day")
    # print(f"This requires studying {m} cards per day")
    # print(m)
    return m


if __name__ == "__main__":
    main()