import { useState } from "react";
import { ContractAbi } from "../contracts";
import { bn } from "fuels";

interface ListItemsProps {
  contract: ContractAbi | null;
}

export default function ListItem({ contract }: ListItemsProps) {
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    if (contract !== null) {
      try {
        const priceInput = bn.parseUnits(price.toString());
        await contract.functions
          .list_item(priceInput, description, imageUrl)
          .txParams({
            gasLimit: 300_000,
          })
          .call();
        setStatus('success');
      } catch (e) {
        console.log("ERROR:", e);
        setStatus('error');
      }
    } else {
      console.log("ERROR: Contract is null");
      setStatus('error');
    }
  }

  return (
    <div>
      <h2>List an Item</h2>
      {status === 'none' && (
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="description">Item Description:</label>
            <input
              id="description"
              type="text"
              maxLength={50}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label htmlFor="image-url">Item Image URL:</label>
            <input
              id="image-url"
              type="text"
              maxLength={50}
              required
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label htmlFor="price">Item Price:</label>
            <input
              id="price"
              type="number"
              required
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>

          <div className="form-control">
            <button type="submit">List item</button>
          </div>
        </form>
      )}

      {status === 'success' && <div>Item successfully listed!</div>}
      {status === 'error' && <div>Error listing item. Please try again.</div>}
      {status === 'loading' && <div>Listing item...</div>}
    </div>
  );
}
