import React from 'react';
import {
  BuildingIcon,
  LocationPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  BankNoteIcon,
} from './Icons';

export const JobCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="apple-card">
      <h2 className="job-title">{data.title || 'Untitled Role'}</h2>

      {data.company && (
        <div className="company-row">
          <BuildingIcon size={13} color="var(--apple-blue)" />
          <span className="company-name">{data.company}</span>
        </div>
      )}

      {(data.location || data.type || data.datePosted || data.salary) && (
        <div className="badge-row">
          {data.location && (
            <span className="apple-badge">
              <LocationPinIcon size={11} color="currentColor" />
              <span>{data.location}</span>
            </span>
          )}

          {data.type && (
            <span className="apple-badge badge-neutral">
              <BriefcaseIcon size={11} color="currentColor" />
              <span>{data.type}</span>
            </span>
          )}

          {data.datePosted && (
            <span className="apple-badge badge-neutral">
              <CalendarIcon size={11} color="currentColor" />
              <span>{data.datePosted}</span>
            </span>
          )}

          {data.salary && (
            <span className="apple-badge badge-accent">
              <BankNoteIcon size={11} color="currentColor" />
              <span>{data.salary}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
