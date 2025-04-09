import api from '../api';

export interface Review {
  id: string;
  bikeId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    roles: string;
    subscriptionPlan: string;
  };
  reservation: {
    id: string;
    reservationTime: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    status: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  timestamp: string;
}

export const reviewService = {
  getBikeReviews: async (bikeId: string): Promise<Review[]> => {
    const response = await api.get<ReviewsResponse>(`/v1/reviews/bike/${bikeId}`);
    return response.data.data;
  }
}; 