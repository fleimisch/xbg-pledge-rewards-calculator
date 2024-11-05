import { writable, derived, type Readable } from 'svelte/store';

interface DeviceStore extends Readable<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    breakpoint: 'mobile' | 'tablet' | 'desktop';
}> {
    init: () => void | (() => void);
}

function createDeviceStore(): DeviceStore {
    const breakpoint = writable<'mobile' | 'tablet' | 'desktop'>('desktop');
    
    // Derive the combined store with all properties
    const { subscribe } = derived(breakpoint, $breakpoint => ({
        isMobile: $breakpoint === 'mobile',
        isTablet: $breakpoint === 'tablet',
        isDesktop: $breakpoint === 'desktop',
        breakpoint: $breakpoint
    }));

    let initialized = false;

    function init() {
        if (initialized || typeof window === 'undefined') return;

        const updateBreakpoint = () => {
            const width = window.innerWidth;
            if (width < 768) {
                breakpoint.set('mobile');
            } else if (width < 1024) {
                breakpoint.set('tablet');
            } else {
                breakpoint.set('desktop');
            }
        };

        // Initial check
        updateBreakpoint();
        
        // Add resize listener
        window.addEventListener('resize', updateBreakpoint);
        initialized = true;

        // Cleanup function
        return () => {
            window.removeEventListener('resize', updateBreakpoint);
            initialized = false;
        };
    }

    return {
        subscribe,
        init
    };
}

export const device = createDeviceStore(); 