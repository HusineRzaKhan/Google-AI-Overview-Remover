// Google AI Overview Remover Content Script
(function() {
    'use strict';
    
    // Function to check if element contains AI Overview content
    function isAIOverview(element) {
        // Skip if element is too small or doesn't have meaningful content
        if (element.offsetHeight < 20 || element.textContent.trim().length < 10) {
            return false;
        }
        
        // Strict rule: Only consider it AI Overview if we find the hidden heading
        // or the visible label inside .Fzsovc that says "AI Overview".
        const hiddenHeading = element.querySelector('h1[style*="clip:rect"]');
        const hasHiddenAIHeading = !!(hiddenHeading && hiddenHeading.textContent.toLowerCase().includes('ai overview'));
        
        const labelEl = element.querySelector('.Fzsovc');
        const hasVisibleAILabel = !!(labelEl && labelEl.textContent.trim().toLowerCase().includes('ai overview'));
        
        return hasHiddenAIHeading || hasVisibleAILabel;
    }
    
    // Function to remove AI Overview elements
    function removeAIOverview() {
        let removedCount = 0;
        
        // Safety check: Don't remove too many elements at once
        const maxRemovals = 10;
        let currentRemovals = 0;
        
        // Method 1: Look for elements with AI-related attributes (most specific)
        const attributeSelectors = [
            '[data-mcpr]',
            '[data-mg-cp]',
            '[data-mcp]',
            '.YzCcne',
            '.hdzaWe',
            '.Fzsovc',
            '.EyBRub',
            '.jUja0e',
            '.aPfNm',
            '.Pqkn2e',
            '.rNSxBe',
            '.jloFI',
            '.GkDqAd',
            '[data-ved*="ai"]',
            '[jscontroller*="ai"]',
            '.ai-overview',
            '#ai-overview',
            '.gemini',
            '[data-ai-overview]',
            '[data-ai-summary]',
            '[data-ai-answer]',
            '[data-ai-response]',
            '[data-ai-explanation]',
            '[data-ai-insight]',
            '[data-ai-analysis]'
        ];
        
        attributeSelectors.forEach(selector => {
            if (currentRemovals >= maxRemovals) return;
            
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (currentRemovals >= maxRemovals) return;
                    
                    if (isAIOverview(element)) {
                        // Double-check it's not a critical page element
                        if (!isCriticalElement(element)) {
                            element.remove();
                            removedCount++;
                            currentRemovals++;
                        }
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
        
        // Method 2: Do not blanket-remove generic search result containers anymore.
        // We only remove confirmed AI Overview containers (via isAIOverview).
        
        if (removedCount > 0) {
            console.log(`Google AI Overview Remover: Removed ${removedCount} AI Overview elements`);
        }
    }
    
    // Function to check if an element is critical and shouldn't be removed
    function isCriticalElement(element) {
        // Don't remove critical page elements
        const criticalTags = ['html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style'];
        if (criticalTags.includes(element.tagName.toLowerCase())) {
            return true;
        }
        
        // Don't remove navigation elements
        const navSelectors = ['nav', '.nav', '#nav', 'header', '.header', '#header', 'footer', '.footer', '#footer'];
        if (navSelectors.some(selector => element.matches(selector) || element.closest(selector))) {
            return true;
        }
        
        // Don't remove search input and controls (and suggestion dropdown)
        const searchSelectors = ['input[type="search"]', '.search', '#search', '.gLFyf', '.RNNXgb', '.erkvQe', '.UUbT9', '#Alh6id'];
        if (searchSelectors.some(selector => element.matches(selector) || element.closest(selector))) {
            return true;
        }
        
        // Protect right-hand knowledge panel area
        const rhsSelectors = ['#rhs', '.rhs', '#rhs_block', '.kp-wholepage', '.knowledge-panel'];
        if (rhsSelectors.some(selector => element.matches(selector) || element.closest(selector))) {
            return true;
        }
        
        // Don't remove if it's the main content area
        if (element.offsetHeight > window.innerHeight * 0.8) {
            return true;
        }
        
        return false;
    }
    
    // Function to remove AI Overview with more targeted detection
    function targetedRemoveAIOverview() {
        let removedCount = 0;
        const maxRemovals = 5; // More conservative for targeted removal
        let currentRemovals = 0;
        
        // First, try to find and remove the main AI Overview container
        const mainAIContainer = document.querySelector('[data-mcpr][class*="YzCcne"]');
        if (mainAIContainer && !isCriticalElement(mainAIContainer)) {
            mainAIContainer.remove();
            removedCount++;
            currentRemovals++;
            console.log('Google AI Overview Remover: Removed main AI Overview container');
        }
        
        // Look for specific Google AI Overview containers
        const aiOverviewSelectors = [
            '[data-mcpr]',
            '[data-mg-cp]',
            '[data-mcp]',
            '.YzCcne',
            '.hdzaWe',
            '.Fzsovc',
            '.EyBRub',
            '.jUja0e',
            '.aPfNm',
            '.Pqkn2e',
            '.rNSxBe',
            '.jloFI',
            '.GkDqAd',
            '[data-ved*="ai"]',
            '[jscontroller*="ai"]',
            '.ai-overview',
            '#ai-overview',
            '.gemini',
            '[class*="ai-overview"]',
            '[id*="ai-overview"]',
            '[data-ai]'
        ];
        
        aiOverviewSelectors.forEach(selector => {
            if (currentRemovals >= maxRemovals) return;
            
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (currentRemovals >= maxRemovals) return;
                    
                    if (isAIOverview(element) && !isCriticalElement(element)) {
                        // Try to remove the entire search result container
                        const searchResult = element.closest('.g, .tF2Cxc, .MjjYud, .g-blk');
                        if (searchResult && !isCriticalElement(searchResult)) {
                            searchResult.remove();
                            removedCount++;
                            currentRemovals++;
                        } else if (!isCriticalElement(element)) {
                            element.remove();
                            removedCount++;
                            currentRemovals++;
                        }
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
        
        if (removedCount > 0) {
            console.log(`Google AI Overview Remover (Targeted): Removed ${removedCount} AI Overview elements`);
        }
    }
    
    // Function to initialize the observer safely
    function initializeObserver() {
        // Check if document.body exists
        if (!document.body) {
            // If body doesn't exist yet, wait and try again
            setTimeout(initializeObserver, 100);
            return;
        }
        
        // Set up observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            
            if (shouldCheck) {
                setTimeout(removeAIOverview, 100);
                setTimeout(targetedRemoveAIOverview, 500);
                setTimeout(aggressiveRemoveAIOverview, 1000);
            }
        });
        
        // Start observing
        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('Google AI Overview Remover: Observer initialized successfully');
        } catch (error) {
            console.error('Google AI Overview Remover: Failed to initialize observer:', error);
        }
    }
    
    // Function to aggressively remove AI Overview by looking for hidden heading
    function aggressiveRemoveAIOverview() {
        let removedCount = 0;
        
        // Look for the hidden "AI overview" heading and remove its parent container
        const hiddenAIHeadings = document.querySelectorAll('h1[style*="clip:rect"]');
        hiddenAIHeadings.forEach(heading => {
            if (heading.textContent.toLowerCase().includes('ai overview')) {
                // Find the main container (usually has data-mcpr attribute)
                let container = heading.closest('[data-mcpr]') || 
                              heading.closest('.YzCcne') ||
                              heading.closest('[data-mg-cp]') ||
                              heading.closest('[data-mcp]');
                
                if (container && !isCriticalElement(container)) {
                    container.remove();
                    removedCount++;
                    console.log('Google AI Overview Remover: Removed AI Overview via hidden heading detection');
                }
            }
        });
        
        if (removedCount > 0) {
            console.log(`Google AI Overview Remover (Aggressive): Removed ${removedCount} AI Overview elements`);
        }
    }
    
    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeAIOverview();
            aggressiveRemoveAIOverview();
            initializeObserver();
        });
    } else {
        removeAIOverview();
        aggressiveRemoveAIOverview();
        initializeObserver();
    }
    
    // Also run on page load events
    window.addEventListener('load', () => {
        setTimeout(removeAIOverview, 500);
        setTimeout(targetedRemoveAIOverview, 1000);
        setTimeout(aggressiveRemoveAIOverview, 1500);
    });
    window.addEventListener('popstate', () => {
        setTimeout(removeAIOverview, 100);
        setTimeout(targetedRemoveAIOverview, 500);
        setTimeout(aggressiveRemoveAIOverview, 1000);
    });
    
    // Run periodically to catch any missed elements
    setInterval(() => {
        removeAIOverview();
        aggressiveRemoveAIOverview();
    }, 2000);
    
})();
