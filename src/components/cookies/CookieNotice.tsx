import { useRef, useEffect, useState } from 'react';
import { setCookie, getCookie } from '../../utils/utils';
import { useThemeContext } from '../../context/ThemeContext/ThemeContext';
import { CookieSelect } from './CookieSelect';

//*TODO UNIVERSALIZE THIS CLASS
export const CookieNotice = () => {
	const [isVisible, setIsVisible] 	= useState<boolean>(false);
	const [showManage, setShowManage] = useState<boolean>(false);
	const manageSelected              = useRef<Array<boolean>>([]);

	const inputOptions     = ["Список Криптовалют", "Выбор Темы"];
	inputOptions.map(() => {manageSelected.current.push(false);});

	const { theme } = useThemeContext();

	useEffect(() => {
		const cookiesAccepted = getCookie('cookies_accepted');
		if (!cookiesAccepted) {
			setIsVisible(true);
		}
	}, []);

	const handleAcceptAll = () => {
		setCookie('cookies_accepted', 'true', 365);
		setCookie('cookie_theme_accepted', 'true', 365);
		setCookie('cookie_data_accepted', 'true', 365);
		setIsVisible(false);
	};

	const handleDecline = () => {
		setIsVisible(false);
	}

	const handleOpenManage = () => {
    setShowManage(true);
  };

	const handleSelect = (index: number) => {
		manageSelected.current[index] = !manageSelected.current[index];
	}

  const handleCloseManage = () => {
    setShowManage(false);
		const [dataAccepted, themeAccepted] = manageSelected.current;
		if (manageSelected.current.some(Boolean))
			setCookie('cookies_accepted', 'true', 365);
		
		if (themeAccepted) setCookie('cookie_theme_accepted', 'true', 365);
		if (dataAccepted)  setCookie('cookie_data_accepted', 'true', 365);
		
		if (themeAccepted || dataAccepted) setIsVisible(false);
  };

	const wrapperClassName = `${theme === 'dark'
		? 'bg-gray-800 text-white'
		: 'bg-white text-gray-900'} p-6 rounded-lg w-full max-w-xl text-center`;	
	const buttonClassName = `${theme === 'dark'
		? 'bg-gray-600 hover:bg-gray-700'
		: 'bg-gray-300 hover:bg-gray-400'} px-4 py-2 rounded transition`;	

	return (
		isVisible && (
			<>
				{!showManage && (
					<div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50 animate-slide-up">
						<div className={wrapperClassName}>
							<p>Этот сайт использует куки для улучшения вашего опыта.</p>
							<div className="mt-4 space-x-4">
								<button
									onClick={handleAcceptAll}
									className={buttonClassName}
								>
									Принять все
								</button>
								{inputOptions.length > 0 && (
									<button
										onClick={handleOpenManage}
										className={buttonClassName}
									>
										Настроить
									</button>
								)}
								<button
									onClick={handleDecline}
									className={buttonClassName}
								>
									Отклонить
								</button>
							</div>
						</div>
					</div>
				)}

				{showManage &&  (
					<div className="fixed inset-0 z-50">
						<CookieSelect 
							onClose={handleCloseManage}
							inputOptions={inputOptions}
							handleSelect={handleSelect}
							wrapperClassName={wrapperClassName}
							buttonClassName={buttonClassName}
						/>
					</div>
				)}
			</>
		)
	);
}
