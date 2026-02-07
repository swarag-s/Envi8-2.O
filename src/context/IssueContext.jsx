import { createContext, useContext, useState, useEffect } from 'react';

const IssueContext = createContext();

export const useIssues = () => {
    const context = useContext(IssueContext);
    if (!context) {
        throw new Error('useIssues must be used within IssueProvider');
    }
    return context;
};

export const IssueProvider = ({ children }) => {
    const [issues, setIssues] = useState([]);
    const [wardPlaces, setWardPlaces] = useState({});

    // Load from localStorage on mount
    useEffect(() => {
        const savedIssues = localStorage.getItem('civicai_issues');
        const savedWardPlaces = localStorage.getItem('civicai_ward_places');

        if (savedIssues) {
            setIssues(JSON.parse(savedIssues));
        }

        if (savedWardPlaces) {
            setWardPlaces(JSON.parse(savedWardPlaces));
        } else {
            // Initialize with some default places for demo
            const defaultPlaces = {
                '14': [
                    { id: 1, name: 'Mananchira Square', landmark: 'City Center', lat: 11.2588, lon: 75.7804 },
                    { id: 2, name: 'Medical College', landmark: 'Near Beach', lat: 11.2480, lon: 75.7720 },
                    { id: 3, name: 'Beach Road', landmark: 'Kozhikode Beach', lat: 11.2450, lon: 75.7650 }
                ]
            };
            setWardPlaces(defaultPlaces);
            localStorage.setItem('civicai_ward_places', JSON.stringify(defaultPlaces));
        }
    }, []);

    // Save to localStorage whenever issues change
    useEffect(() => {
        if (issues.length > 0) {
            localStorage.setItem('civicai_issues', JSON.stringify(issues));
        }
    }, [issues]);

    // Save to localStorage whenever wardPlaces change
    useEffect(() => {
        if (Object.keys(wardPlaces).length > 0) {
            localStorage.setItem('civicai_ward_places', JSON.stringify(wardPlaces));
        }
    }, [wardPlaces]);

    // Add new issue
    const addIssue = (issue) => {
        const newIssue = {
            ...issue,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setIssues(prev => [newIssue, ...prev]);
        return newIssue;
    };

    // Update issue status
    const updateIssue = (issueId, updates) => {
        setIssues(prev => prev.map(issue =>
            issue.tokenId === issueId
                ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
                : issue
        ));
    };

    // Get issues by ward
    const getIssuesByWard = (wardNumber) => {
        return issues.filter(issue => issue.ward === `Ward ${wardNumber}`);
    };

    // Get issues by status
    const getIssuesByStatus = (status) => {
        return issues.filter(issue => issue.status === status);
    };

    // Ward Places Management
    const addWardPlace = (wardNumber, place) => {
        setWardPlaces(prev => {
            const wardKey = wardNumber.toString();
            const currentPlaces = prev[wardKey] || [];
            const newPlace = {
                ...place,
                id: Date.now()
            };
            return {
                ...prev,
                [wardKey]: [...currentPlaces, newPlace]
            };
        });
    };

    const updateWardPlace = (wardNumber, placeId, updates) => {
        setWardPlaces(prev => {
            const wardKey = wardNumber.toString();
            const currentPlaces = prev[wardKey] || [];
            return {
                ...prev,
                [wardKey]: currentPlaces.map(place =>
                    place.id === placeId ? { ...place, ...updates } : place
                )
            };
        });
    };

    const deleteWardPlace = (wardNumber, placeId) => {
        setWardPlaces(prev => {
            const wardKey = wardNumber.toString();
            const currentPlaces = prev[wardKey] || [];
            return {
                ...prev,
                [wardKey]: currentPlaces.filter(place => place.id !== placeId)
            };
        });
    };

    const getWardPlaces = (wardNumber) => {
        return wardPlaces[wardNumber.toString()] || [];
    };

    const value = {
        issues,
        addIssue,
        updateIssue,
        getIssuesByWard,
        getIssuesByStatus,
        wardPlaces,
        addWardPlace,
        updateWardPlace,
        deleteWardPlace,
        getWardPlaces
    };

    return (
        <IssueContext.Provider value={value}>
            {children}
        </IssueContext.Provider>
    );
};
