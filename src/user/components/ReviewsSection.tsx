import React, { useState } from 'react';

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string; // Added date for reviews
}

interface ReviewsSectionProps {
  productId: number;
  initialReviews: Review[];
  onNewReview: (productId: number, review: Review) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId, initialReviews, onNewReview }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [userName] = useState('Anonymous'); // Placeholder for user name, setUserName is not used

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview(prev => ({ ...prev, comment: event.target.value }));
  };

  const handleSubmitReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please provide a rating and a comment.');
      return;
    }

    const reviewToAdd: Review = {
      user: userName, // In a real app, this would come from authenticated user
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: new Date().toLocaleDateString(),
    };

    setReviews(prev => [...prev, reviewToAdd]);
    onNewReview(productId, reviewToAdd); // Notify parent component or API
    setNewReview({ rating: 0, comment: '' }); // Reset form
  };

  return (
    <div className="reviews-section-container">
      <h2>Customer Reviews ({reviews.length})</h2>

      <div className="review-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <span className="review-user"><strong>{review.user}</strong></span>
                <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="add-review-form">
        <h3>Leave a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="rating-input">
            <label>Your Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= newReview.rating ? 'filled' : ''}`}
                onClick={() => handleRatingChange(star)}
              >
                ⭐
              </span>
            ))}
          </div>
          <div className="comment-input">
            <label htmlFor="review-comment">Your Comment:</label>
            <textarea
              id="review-comment"
              value={newReview.comment}
              onChange={handleCommentChange}
              rows={4}
              placeholder="Share your thoughts about this product..."
            ></textarea>
          </div>
          <button type="submit" className="submit-review-button">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
