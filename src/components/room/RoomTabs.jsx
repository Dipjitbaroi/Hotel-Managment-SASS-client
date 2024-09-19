import React from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";

const RoomTabs = ({description}) => {
  return (
    <Tabs>
      <TabList className="tabs w-fit mb-4">
        <Tab
          className="tab tab-bordered"
          selectedClassName="tab-active text-green-slimy !border-b-green-slimy"
        >
          <span className={`text-xl`}>Description</span>
        </Tab>
      </TabList>
      <TabPanel>
        <p>
          {description}
        </p>
      </TabPanel>
    </Tabs>
  );
};

export default RoomTabs;
