export default function SellItemForm({
  item,
  quantity,
  setQuantity,
  onSell,
  onClose,
}) {
  // Formatear el valor correctamente para mostrarlo
  const formatValue = () => {
    if (item.value.gold !== undefined) return `${item.value.gold}gp`;
    if (item.value.silver !== undefined) return `${item.value.silver}pp`;
    if (item.value.copper !== undefined) return `${item.value.copper}cp`;
    return "0";
  };

  const handleSell = (e) => {
    e.preventDefault();
    if (item.quantity <= 0) {
      alert("No puedes vender este item porque no tienes suficiente cantidad.");
      return;
    }
    onSell();
  };

  return (
    <form
      className="pure-form pure-form-stacked modal sellitem"
      onSubmit={handleSell}
      style={{ border: "solid 1px white", padding: "1rem" }}
    >
      <h2 style={{ margin: "0" }}>Vender Item</h2>
      <p>{item.name}</p>
      <p>{item.description}</p>
      <p>
        <strong>Valor: </strong> {formatValue()}
      </p>
      <p>
        <strong>Cantidad: </strong> {item.quantity}
      </p>

      <div className="quantity-controls">
        <button
        className="removeButton"
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <input
          className="sellQuantity"
          type="number"
          value={quantity}
          min="1"
          max={item.quantity}
          readOnly

        />
        <button
        className="addButton"
          type="button"
          onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}
     
        >
          +
        </button>
      </div>

      <div className="modaladdmoney-buttons">
        <button className="pure-button" type="submit" style={{ margin: "0" }}>
          <img src="./src/assets/tick.png" alt="" />
        </button>
        <button className="pure-button" type="button" onClick={onClose}>
          <img src="./src/assets/x.png" alt="" />
        </button>
      </div>
    </form>
  );
}
