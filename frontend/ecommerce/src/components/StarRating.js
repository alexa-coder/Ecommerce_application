import { useState } from 'react';

const StarRating = ({
    rating = 0,
    interactive = true,
    onRate,
    userRating = 0,
    productId
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (interactive && onRate) {
            onRate(value);
        }
    };
    const displayRating = hoverRating || (interactive ? userRating : rating);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={`${productId}-star-${star}`}
                    className={`star ${displayRating >= star ? 'filled' : ''}`}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    onClick={() => handleClick(star)}
                    style={{
                        cursor: interactive ? 'pointer' : 'default',
                        color: displayRating >= star ? '#ffc107' : '#e4e5e9',
                        fontSize: '1.5rem',
                        marginRight: '0.25rem'
                    }}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    role="button"
                    tabIndex={interactive ? 0 : -1}
                >
                    {displayRating >= star ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
};

export default StarRating;