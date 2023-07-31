import { AccountBalance } from "./accountBalance/AccountBalance";

export const ContentDappStore = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <AccountBalance />
        <div className="bg-white"> onboard</div>
      </div>
      <div className="flex w-full justify-between bg-white">
        <div>staking</div>
        <div className="flex flex-col items-end">
          <div>assets</div>
          <div>governance</div>
        </div>
      </div>
    </div>
  );
};
