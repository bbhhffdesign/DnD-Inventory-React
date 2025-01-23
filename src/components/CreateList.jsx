export default function CreateList({
  updatedInventory,
  setInventory,
  onSellItem,
}) {
  function updateQuantity(category, index, delta) {
    setInventory({
      [category]: updatedInventory[category].map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ),
    });
  }

  function deleteItem(category, index) {
    setInventory({
      [category]: updatedInventory[category].filter((_, i) => i !== index),
    });
  }

  function toggleEquipmentItem(index, checked) {
    setInventory({
      equipment: updatedInventory.equipment
        .map((item, i) => (i === index ? { ...item, checked } : item))
        .sort((a, b) => (b.checked ? 1 : -1) - (a.checked ? 1 : -1)), // Ordenar con los seleccionados al inicio
    });
  }

  return Object.entries(updatedInventory)
    .filter(([category]) => category !== "wallet" && category !== "maxWeight")
    .map(([category, items]) => (
      <div key={category}>
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        {items.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Peso</th>
                <th>Valor</th>
                <th>Cantidad</th>
                <th>Vender</th>
                <th></th>
              </tr>
            </thead>
            {items.map((item, index) => (
              <tbody key={index}>
                <tr>
                  <td>
                    {category === "equipment" && (
                      <input
                        type="checkbox"
                        checked={item.checked || false}
                        onChange={(e) =>
                          toggleEquipmentItem(index, e.target.checked)
                        }
                      />
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.weight}</td>
                  <td>{item.value}</td>
                  <td>
                    <button
                      className="pure-button"
                      onClick={() => updateQuantity(category, index, -1)}
                    >
                      −
                    </button>
                    {item.quantity}
                    <button
                      className="pure-button"
                      onClick={() => updateQuantity(category, index, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>
                    <button
                      className="pure-button"
                      onClick={() => onSellItem({ category, index, ...item })}
                    >
                      Vender
                    </button>
                  </td>
                  <td>
                    <button
                      className="pure-button"
                      onClick={() => deleteItem(category, index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="7">{item.description}</td>
                </tr>
              </tbody>
            ))}
          </table>
        ) : (
          <p>No hay items</p>
        )}
      </div>
    ));
}
