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
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar onSelect={setSelectedTab} />
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          {renderMainContent()}
          </main>
        <RightSideBar />
      </div>
    </>
  );
}
