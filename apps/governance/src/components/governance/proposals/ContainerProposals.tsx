// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import Link from "next/link";
import { useCallback } from "react";
import { ProposalProps } from "../../../internal/governance/functionality/types";
import { BannerMessages } from "ui-helpers";
import ProposalCard from "./ProposalCard";
import { CLICK_GOVERNANCE_PROPOSAL, useTracker } from "tracker";

const ContainerProposals = ({
  proposals,
  loading,
  error,
}: {
  proposals: ProposalProps[];
  loading: boolean;
  error: unknown;
}) => {
  const { handlePreClickAction } = useTracker(CLICK_GOVERNANCE_PROPOSAL);

  const drawProposals = useCallback(() => {
    if (loading) {
      return <BannerMessages text="Loading..." spinner={true} />;
    }
    if (error) {
      return <BannerMessages text="No results" />;
    }
    return proposals.map((proposal) => {
      return (
        <Link
          key={proposal.id}
          href={{
            pathname: "/",
            query: { id: proposal.id },
          }}
          onClick={() => {
            handlePreClickAction({
              proposal_id: proposal.id,
            });
          }}
          data-testid="proposal"
        >
          <ProposalCard proposalProps={proposal} />
        </Link>
      );
    });
  }, [proposals, loading, error, handlePreClickAction]);

  return (
    <section className="grid grid-flow-row grid-cols-1 gap-4 px-4 md:px-0 lg:grid-cols-2">
      {drawProposals()}
    </section>
  );
};

export default ContainerProposals;
