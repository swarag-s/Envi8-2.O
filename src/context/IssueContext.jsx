import { createContext, useContext, useState, useEffect } from "react";

const IssueContext = createContext(null);

// ✅ SAFE HOOK (NO CRASH)
export const useIssues = () => {
  const context = useContext(IssueContext);

  if (!context) {
    console.warn("useIssues used outside IssueProvider");
    return {
      issues: [],
      wardPlaces: {},
      addIssue: () => {},
      updateIssue: () => {},
      getIssuesByWard: () => [],
      getIssuesByStatus: () => [],
      addWardPlace: () => {},
      updateWardPlace: () => {},
      deleteWardPlace: () => {},
      getWardPlaces: () => [],
      getIssueByToken: () => null,
    };
  }

  return context;
};

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [wardPlaces, setWardPlaces] = useState({});

  // Load from localStorage
  useEffect(() => {
    const savedIssues = localStorage.getItem("civicai_issues");
    const savedWardPlaces = localStorage.getItem("civicai_ward_places");

    if (savedIssues) setIssues(JSON.parse(savedIssues));

    if (savedWardPlaces) {
      setWardPlaces(JSON.parse(savedWardPlaces));
    } else {
      const defaultPlaces = {
        14: [
          {
            id: 1,
            name: "Mananchira Square",
            landmark: "City Center",
            lat: 11.2588,
            lon: 75.7804,
          },
          {
            id: 2,
            name: "Medical College",
            landmark: "Near Beach",
            lat: 11.248,
            lon: 75.772,
          },
          {
            id: 3,
            name: "Beach Road",
            landmark: "Kozhikode Beach",
            lat: 11.245,
            lon: 75.765,
          },
        ],
      };
      setWardPlaces(defaultPlaces);
      localStorage.setItem(
        "civicai_ward_places",
        JSON.stringify(defaultPlaces),
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("civicai_issues", JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem("civicai_ward_places", JSON.stringify(wardPlaces));
  }, [wardPlaces]);

  const addIssue = (issue) => {
    const newIssue = {
      ...issue,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIssues((prev) => [newIssue, ...prev]);
    return newIssue;
  };

  const updateIssue = (issueId, updates) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.tokenId === issueId
          ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
          : issue,
      ),
    );
  };

  const getIssuesByWard = (wardNumber) =>
    issues.filter((issue) => issue.ward === `Ward ${wardNumber}`);

  const getIssuesByStatus = (status) =>
    issues.filter((issue) => issue.status === status);

  const getIssueByToken = (tokenId) =>
    issues.find((issue) => issue.tokenId === tokenId);

  const addWardPlace = (wardNumber, place) => {
    setWardPlaces((prev) => {
      const key = wardNumber.toString();
      return {
        ...prev,
        [key]: [...(prev[key] || []), { ...place, id: Date.now() }],
      };
    });
  };

  const updateWardPlace = (wardNumber, placeId, updates) => {
    setWardPlaces((prev) => {
      const key = wardNumber.toString();
      return {
        ...prev,
        [key]: (prev[key] || []).map((p) =>
          p.id === placeId ? { ...p, ...updates } : p,
        ),
      };
    });
  };

  const deleteWardPlace = (wardNumber, placeId) => {
    setWardPlaces((prev) => {
      const key = wardNumber.toString();
      return {
        ...prev,
        [key]: (prev[key] || []).filter((p) => p.id !== placeId),
      };
    });
  };

  const getWardPlaces = (wardNumber) => wardPlaces[wardNumber.toString()] || [];

  return (
    <IssueContext.Provider
      value={{
        issues,
        wardPlaces,
        addIssue,
        updateIssue,
        getIssuesByWard,
        getIssuesByStatus,
        addWardPlace,
        updateWardPlace,
        deleteWardPlace,
        getWardPlaces,
        getIssueByToken,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
