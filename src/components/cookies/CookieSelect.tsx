interface CookieSelectProps {
	onClose: 				  () => void;
	inputOptions:     Array<string>;
	handleSelect:     (index: number) => void;
	wrapperClassName: string;
	buttonClassName:  string;
}

export const CookieSelect = ({ onClose, inputOptions, handleSelect, wrapperClassName, buttonClassName }: CookieSelectProps) => {
	return (
		<div className="bg-black/70 w-full h-full flex justify-center items-center animate-slide-up">
			<div className={wrapperClassName}>
				<h2 className="text-xl font-semibold mb-4">Настройки куки</h2>
				<div className="text-left mb-4">
					{inputOptions.map((item: string, index: number) => (
						<label key={item} className="block mb-2">
							<input type="checkbox" onClick={() => {
								handleSelect(index);
							}}/> {item}
						</label>
					))}
				</div>
				<button
					className={buttonClassName}
					onClick={onClose}
				>
					Сохранить
				</button>
			</div>
		</div>
	);
}
  