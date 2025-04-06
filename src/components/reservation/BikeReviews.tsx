import { Star, User } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface BikeReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const BikeReviews = ({ reviews, averageRating, totalReviews }: BikeReviewsProps) => {
  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
        <div className="space-y-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{totalReviews} reviews</div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{review.userName}</div>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BikeReviews; 