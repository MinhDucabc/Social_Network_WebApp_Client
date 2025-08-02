// HomePage.jsx
import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import RightSideBar from "../components/right-sidebar.jsx";
import ContentFeed from "../features/content-feed.jsx";
import Header from "../components/header.jsx";

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("content");

  const renderMainContent = () => {
    switch (selectedTab) {
      case "content":
        return <ContentFeed />;
      // case "groups":
      //   return <ExploreGroup />;
      // case "tags":
      //   return <ExploreTag />;
      default:
        return <ContentFeed />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelect={setSelectedTab} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto w-full">
            {renderMainContent()}
          </div>
        </main>
        <RightSideBar />
      </div>
    </div>
  );
}
