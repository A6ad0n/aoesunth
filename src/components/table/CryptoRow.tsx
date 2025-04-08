import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { useDataHandler } from '../../context/DataHandlerContext/DataHandlerContext';
import { useThemeContext } from '../../context/ThemeContext/ThemeContext';
import { TickData } from '../../types/types';

interface CryptoRowProps {
	value: 							TickData;
	tabIndex: 					number;
	updateButtonStyle?: string;
	deleteButtonStyle?: string;
}

export const CryptoRow = ({ value, tabIndex, updateButtonStyle, deleteButtonStyle }: CryptoRowProps) => {
	const { updateAction, isAddedRefs, removing, handleDelete } = useDataHandler();
	const { theme } = useThemeContext();
	const isExiting: boolean = removing.has(value.INSTRUMENT);
	const isAdding = isAddedRefs ? isAddedRefs.current.has(value.INSTRUMENT) : false;

	let icon;
  if (value.PRICE_FLAG === "UP") {
    icon = <FaArrowUp className="w-6 h-6 text-green-500" />;
  } else if (value.PRICE_FLAG === "DOWN") {
    icon = <FaArrowDown className="w-6 h-6 text-red-500" />;
  } else {
    icon = <FaMinus className="w-6 h-6 text-gray-800" />;
  }

	//*TODO loading animation
	const buttonBase = `px-3 py-1 rounded-lg transition-colors`;
	const updateButtonClassName = updateButtonStyle ?? (
	  `${buttonBase} tab-index${tabIndex - 2} ${
		theme === 'dark'
		  ? 'bg-amber-600 hover:bg-amber-500/80'
		  : 'bg-amber-500 hover:bg-amber-400/80'
	  }`
	);
	const deleteButtonClassName = deleteButtonStyle ?? (
	  `${buttonBase} tab-index${tabIndex - 1} ${
		theme === 'dark'
		  ? 'bg-red-600 hover:bg-red-500/80'
		  : 'bg-red-500 hover:bg-red-400/80'
	  }`
	);
	
	return (
		<tr
			className={`rounded-xl shadow-lg hover:shadow-2xl
				transition-transform duration-300 ease-in-out transform hover:scale-103
				${isExiting ? 'animate-slide-out' : isAdding ? 'animate-slide-in' : ''}
			`}
			onAnimationEnd={() => {isAddedRefs?.current.delete(value.INSTRUMENT)}}
		>
			<td className="px-6 py-4 font-semibold">{value.INSTRUMENT}</td>
			<td className="px-6 py-4 font-semibold">{value.PRICE.toFixed(6)}</td>
			<td className="px-6 py-4 pl-10">{icon}</td>
			<td className="px-6 py-4">{new Date(value.PRICE_LAST_UPDATE_TS * 1000).toLocaleString()}</td>
			<td className="px-6 py-4">
				<div className="flex flex-col gap-2">
					<button 
						className={updateButtonClassName}
						onClick={() => updateAction([value.INSTRUMENT])}
					>
						Update
					</button>
					<button 
						className={deleteButtonClassName}
						onClick={() => handleDelete(value.INSTRUMENT)}
					>
						Delete
					</button>
				</div>
			</td>
		</tr>
	)
}
