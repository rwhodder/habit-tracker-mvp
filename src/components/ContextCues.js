import React from 'react';

function ContextCues({ habit, onToggleClue }) {
  return (
    <>
      {habit.contextCues.map((context, idx) => (
        <div key={idx} style={{ position: 'relative', marginBottom: 40 }}>
          <div
            style={{
              padding: '14px 0',
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              width: 160,
              margin: '0 auto',
              cursor: 'pointer',
              border: context.done ? '2px solid #27ae60' : '2px solid #bbb',
              transition: 'border 0.2s',
            }}
            onClick={() => onToggleClue(habit.id, idx)}
            title="Click to mark complete/incomplete"
          >
            <span
              style={{
                fontWeight: 600,
                opacity: context.done ? 0.6 : 1,
                textDecoration: context.done ? 'line-through' : 'none',
                color: context.done ? '#27ae60' : '#111',
              }}
            >
              Context Clue {idx + 1}:
            </span>{' '}
            {context.cue}
          </div>
          {idx < habit.contextCues.length && (
            <div
              style={{
                width: 4,
                height: 40,
                background: '#666',
                borderRadius: 2,
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translateX(-50%)',
              }}
            ></div>
          )}
        </div>
      ))}
    </>
  );
}

export default ContextCues;
