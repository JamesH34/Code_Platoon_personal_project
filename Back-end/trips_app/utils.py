from datetime import timedelta

def calculate_total_cost(trip):
    trip_length = (trip.end_date - trip.start_date) + timedelta(days=1)
    total_cost = trip.bike.price * trip_length.days
    print("Calculating total cost:", total_cost)
    return total_cost