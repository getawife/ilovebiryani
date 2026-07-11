'use client';

import { useState } from 'react';
import PlayerSection from "../[id]/PlayerSection";
import SeasonSelector from "../../../components/SeasonSelector";

export default function WatchPageClient({ type, id, validSeasons, isReleased }) {
    const [selectedSeason, setSelectedSeason] = useState(() =>
        validSeasons?.length > 0 ? validSeasons[0].season_number : 1
    );

    return (
        <>
            <PlayerSection
                type={type}
                id={id}
                seasonsData={validSeasons}
                isReleased={isReleased}
                selectedSeason={selectedSeason}
            />

            {type === "tv" && validSeasons?.length > 0 && (
                <div className="mt-6">
                    <SeasonSelector
                        seasons={validSeasons}
                        selectedSeason={selectedSeason}
                        onSeasonChange={setSelectedSeason}
                    />
                </div>
            )}
        </>
    );
}