from datetime import timedelta

def calculate_total_cost(trip):
    trip_length = trip.end_date - trip.start_date
    return trip.bike.price * trip_length.days