export default function SellItemForm({
  item,
  quantity,
  setQuantity,
  onSell,
  onClose,
}) {
  const incrementQuantity = () => {
    if (quantity < item.quantity) {
      setQuantity(quantity + 1); // Incrementa la cantidad, pero no excede el máximo
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Decrementa la cantidad, pero no baja de 1
    }
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
      <p>
         {item.name}
      </p>
      <p>
         {item.description}
      </p>
      <p>
        <strong>Valor: </strong>
         {item.value}
      </p>
      <p>
        <strong>Cantidad: </strong>
        {item.quantity}
      </p>
      <div className="quantity-controls">
        <button
          type="button"
          onClick={decrementQuantity}
          disabled={item.quantity <= 0} // Deshabilita si la cantidad es 0 o menor
          style={{
            padding: "0.5rem",
            fontSize: "1.5rem",
            width: "2rem",
            height: "2rem",
          }}
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
          disabled={item.quantity <= 0} // Deshabilita el input si la cantidad es 0 o menor
          style={{
            textAlign: "center",
            width: "3rem",
            margin: "0 0.5rem",
            fontSize: "1rem",
          }}
        />
        <button
          type="button"
          onClick={incrementQuantity}
          disabled={item.quantity <= 0} // Deshabilita si la cantidad es 0 o menor
          style={{
            padding: "0.5rem",
            fontSize: "1.5rem",
            width: "2rem",
            height: "2rem",
          }}
        >
          +
        </button>
      </div>
      <div className="modaladdmoney-buttons">
        <button
          className="pure-button"
          type="submit"
          style={{ margin: "0" }}
          disabled={item.quantity <= 0} // Deshabilita el botón de vender si no hay cantidad suficiente
        >
          <img src="./src/assets/tick.png" alt="" />
        </button>
        <button className="pure-button" type="button" onClick={onClose}>
          <img src="./src/assets/x.png" alt="" />
        </button>
      </div>
    </form>
  );
}
