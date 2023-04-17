import { useWallet} from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const WithdrawSol = () => {
    const wallet = useWallet();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io("http://localhost:4000/general");
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleClick = async () => {
        try {
            const amount = parseFloat(document.getElementById("withdraw-input").value);
            if (isNaN(amount)) {
                toast.error("Please enter a valid amount.");
                return;
            }
            if (!wallet.publicKey) {
                toast.error("Please connect your wallet first.");
                return;
            }

            const lamports = Math.round(amount * 1000000000);
            const username = document.getElementById("username").innerHTML;

            // Solicitar la transacción desde el servidor
            socket.emit("requestWithdraw", {
                username: username,
                amount: lamports,
                publicKey: wallet.publicKey.toString(),
            });

            await toast.promise(
                new Promise((resolve, reject) => {
                    socket.on("withdraw-success", (data) => {
                        resolve(data);
                    });
                    socket.on("withdraw-error", (error) => {
                        reject(error);
                    });
                }),
                {
                    pending: "Sending withdraw request...",
                    success: "Withdrawal successful!",
                    error: "Try again later.",
                }
            );
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="withdraw-sol">
            <h2>Withdraw SOL</h2>
            <input type="number" id="withdraw-input" placeholder="Amount in SOL" />
            <button onClick={handleClick}>Withdraw</button>
        </div>
    );
};

export default WithdrawSol;