import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || 
                         options.flatMap(opt => opt.options || []).find(opt => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden input for form validation if needed */}
      {required && (
        <input 
          type="text" 
          required 
          value={value} 
          onChange={() => {}} 
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} 
        />
      )}
      
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: isOpen ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(56, 189, 248, 0.1)' : 'none'
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown 
          size={16} 
          style={{ 
            transition: 'transform 0.2s ease', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-secondary)'
          }} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            maxHeight: '250px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: '4px'
          }}
        >
          {options.length === 0 && (
            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No options available
            </div>
          )}
          
          {options.map((opt, index) => {
            // Handle OptGroups
            if (opt.options) {
              return (
                <div key={index} style={{ marginBottom: '4px' }}>
                  <div style={{ 
                    padding: '8px 12px', 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    fontWeight: 600
                  }}>
                    {opt.label}
                  </div>
                  {opt.options.map(subOpt => (
                    <OptionItem 
                      key={subOpt.value}
                      option={subOpt}
                      isSelected={value === subOpt.value}
                      onSelect={() => {
                        onChange(subOpt.value);
                        setIsOpen(false);
                      }}
                    />
                  ))}
                </div>
              );
            }
            
            // Handle regular options
            return (
              <OptionItem 
                key={opt.value}
                option={opt}
                isSelected={value === opt.value}
                onSelect={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const OptionItem = ({ option, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '10px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '6px',
        background: isSelected ? 'rgba(56, 189, 248, 0.15)' : isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        color: isSelected ? '#38bdf8' : 'var(--text-primary)',
        fontSize: '0.9rem',
        transition: 'background 0.1s ease',
        margin: '2px 0'
      }}
    >
      <span>{option.label}</span>
      {isSelected && <Check size={16} color="#38bdf8" />}
    </div>
  );
};
