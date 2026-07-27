export function getRatingColor(voteAverage) {
    if (!voteAverage || voteAverage === 0) return 'rating-average';
    const rating = Number(voteAverage);
    if (rating >= 7.5) return 'rating-excellent';
    if (rating >= 6.0) return 'rating-good';
    if (rating >= 4.5) return 'rating-average';
    return 'rating-poor';
}
