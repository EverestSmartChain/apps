// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const SideBar = dynamic(() => import("./Sidebar/Sidebar"));
const SidebarMobile = dynamic(() => import("./Sidebar/SidebarMobile"));
import { StatefulHeader } from "./StatefulHeader";
import { StatefulFooter } from "./StatefulFooter";
import { ContentDappStore } from "./dappStore/ContentDappStore";

const MainContainer = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <StatefulHeader
        pageName={t("appTitle")}
        setShowSidebar={setShowSidebar}
      />
      <div className="block lg:hidden ">
        <SidebarMobile
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </div>
      <div className="grid grid-cols-8 space-x-5">
        <div className="hidden lg:block ">
          <SideBar />
        </div>
        <div className="col-span-8 flex flex-1 flex-col lg:col-span-7">
          <div className="container mx-auto mb-auto overflow-auto">
            <ContentDappStore />
          </div>
          <StatefulFooter />
        </div>
      </div>
    </>
  );
};

export default MainContainer;
