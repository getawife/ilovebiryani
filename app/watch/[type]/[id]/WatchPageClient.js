'use client';

import { useState } from 'react';
import PlayerSection from "../[id]/PlayerSection";
import SeasonSelector from "../../../components/SeasonSelector";

export default function WatchPageClient({ type, id, validSeasons, isReleased }) {
    const [selectedSeason, setSelectedSeason] = useState(
        validSeasons.length > 0 ? validSeasons[0].season_number : 1
    );

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber);
    };

    return (
        <>
            <PlayerSection
                type={type}
                id={id}
                seasonsData={validSeasons}
                isReleased={isReleased}
                selectedSeason={selectedSeason}
            />

            {/* Season Selector for TV Shows */}
            {type === "tv" && validSeasons.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                    <SeasonSelector
                        seasons={validSeasons}
                        selectedSeason={selectedSeason}
                        onSeasonChange={handleSeasonChange}
                    />
                </div>
            )}
        </>
    );
}