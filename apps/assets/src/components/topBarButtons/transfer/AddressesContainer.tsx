import { CopyContainer } from "./CopyContainer";
import { useAccount } from "wagmi";
import { ethToEvmos } from "@evmos/address-converter";
export const AddressesContainer = () => {
  const copyToClipboard = async (wallet: string) => {
    await navigator.clipboard.writeText(wallet);
  };

  const { address } = useAccount();

  const handleCosmosFormat = async () => {
    await copyToClipboard(ethToEvmos(address as string));
  };

  const handleEthFormat = async () => {
    await copyToClipboard(address as string);
  };

  return (
    <div className="flex flex-col space-y-1">
      <CopyContainer
        address={ethToEvmos(address as string)}
        handleOnClick={handleCosmosFormat}
      />

      <CopyContainer
        address={address as string}
        handleOnClick={handleEthFormat}
      />
    </div>
  );
};
