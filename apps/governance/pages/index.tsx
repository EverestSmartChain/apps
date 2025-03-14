// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import dynamic from "next/dynamic";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  store,
  StoreType,
  Snackbars,
  getAllSnackbars,
  WalletProvider,
} from "evmos-wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TermOfServices, Container, MavaWidget } from "ui-helpers";
import { StatefulHeader } from "stateful-components";
import { HeadComponent } from "../src/components/governance/HeadComponent";
import { GoogleAnalytics } from "../src/components/GoogleAnalytics";
import { StatefulFooter } from "stateful-components";
const Content = dynamic(() => import("../src/components/governance/Content"));
import { MixpanelProvider } from "tracker";
import { GiveFeedback } from "../src/components/GiveFeedback";

function SnackbarsInternal() {
  const valueRedux = useSelector((state: StoreType) => getAllSnackbars(state));
  const dispatch = useDispatch();
  return <Snackbars valueRedux={valueRedux} dispatch={dispatch} />;
}
export default function Home() {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <MixpanelProvider
            config={{ ip: false }}
            token={process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? ""}
          >
            <>
              <HeadComponent />
              <GoogleAnalytics />
              <main>
                <TermOfServices />
                <GiveFeedback />
                <Container>
                  <>
                    <SnackbarsInternal />
                    <StatefulHeader pageName="Governance" page="governance" />
                    <MavaWidget />
                    <div className="container mx-auto mb-auto overflow-auto">
                      <Content />
                    </div>
                    <StatefulFooter />
                  </>
                </Container>
              </main>
            </>
          </MixpanelProvider>
        </WalletProvider>
      </QueryClientProvider>
    </Provider>
  );
}
