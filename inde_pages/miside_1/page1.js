document.addEventListener("DOMContentLoaded", function() {
    setupCollapsibles();
    autoSetTitle();
    setLanguage('en'); // Set default language for content
    });
    function setupCollapsibles() {
    const collapsibleButtons = document.querySelectorAll(".collapsible-button");
    const collapseBottomTriggers = document.querySelectorAll(".collapse-trigger-bottom");
    collapsibleButtons.forEach(button => {
    button.addEventListener("click", function() {
    toggleItem(this);
    });
    });
    collapseBottomTriggers.forEach(button => {
    button.addEventListener("click", function() {
    const contentId = this.getAttribute('aria-controls');
    const topButton = document.querySelector(`.collapsible-button[aria-controls="${contentId}"]`);
    if (topButton) {
    toggleItem(topButton, true);
    }
    });
    });
    }
    function findPrecedingSourceTitle(element) {
    let currentElement = element.parentElement; // Start with the .collapsible-item div
    let sibling = currentElement.previousElementSibling;
    while (sibling) {
    if (sibling.classList.contains('source-title')) {
    return sibling;
    }
    // Check if we hit another collapsible item from a *previous* group without finding title
    if (sibling.classList.contains('collapsible-item') || sibling.tagName === 'H3') {
    // If the previous element is H3, it must be the title we want
    if (sibling.tagName === 'H3' && sibling.classList.contains('source-title')){
    return sibling;
    }
    // Otherwise, keep searching upwards within the same logical block if needed,
    // but this loop structure should find the immediate preceding title.
    }
    sibling = sibling.previousElementSibling;
    }
    // Fallback for the very first item potentially? Or if structure is unexpected.
    console.warn("Could not find preceding source title for", element);
    return null;
    }
    function toggleItem(button, collapseFromBottom = false) {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    if (!content) return;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const sourceTitle = findPrecedingSourceTitle(button);
    button.setAttribute('aria-expanded', !isExpanded);
    if (isExpanded) {
    // --- Collapse ---
    content.style.paddingTop = '0';
    content.style.paddingBottom = '0';
    content.style.maxHeight = content.scrollHeight + "px"; // Set explicit height before transition
    requestAnimationFrame(() => { // Needs slight delay to apply height before transition starts
    content.style.maxHeight = '0px';
    // Scroll source title into view *after* collapse starts
    if (sourceTitle) {
    // Delay scroll until animation is partially complete
    button.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
    });
    } else {
    // --- Expand ---
    content.style.paddingTop = '2rem'; // Match CSS padding
    content.style.paddingBottom = '2rem';
    // Set max-height based on scrollHeight *after* setting padding
    content.style.maxHeight = content.scrollHeight + "px";
    // Recalculate in case content loads dynamically or fonts change size
    setTimeout(() => {
    if (button.getAttribute('aria-expanded') === 'true') {
    content.style.maxHeight = content.scrollHeight + "px";
    }
    }, 550);
    // Scroll the top button into view slightly when expanding, unless collapsing from bottom triggered it
    if (!collapseFromBottom) {
    button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    }
    }
    function autoSetTitle() {
    const lang = navigator.language || navigator.userLanguage;
    const titleContainer = document.getElementById('auto-title');
    if (!titleContainer) return;
    titleContainer.querySelectorAll('span[class^="title-"]').forEach(span => span.style.display = 'none');
    let targetTitleSpan = null;
    if (lang.startsWith("ru")) {
    targetTitleSpan = titleContainer.querySelector(".title-ru");
    document.documentElement.lang = 'ru';
    } else if (lang.startsWith("zh")) {
    targetTitleSpan = titleContainer.querySelector(".title-zh");
    document.documentElement.lang = 'zh';
    } else {
    targetTitleSpan = titleContainer.querySelector(".title-en");
    document.documentElement.lang = 'en';
    }
    if (targetTitleSpan) {
    targetTitleSpan.style.display = "inline";
    document.title = targetTitleSpan.textContent || targetTitleSpan.innerText;
    } else {
    const firstTitle = titleContainer.querySelector('span[class^="title-"]');
    if(firstTitle){
    firstTitle.style.display = "inline";
    document.title = firstTitle.textContent || firstTitle.innerText;
    document.documentElement.lang = firstTitle.lang || 'en';
    }
    }
    }
    // --- TRANSLATIONS OBJECT 
    const translations = {
        "1" : {
            zh: "这是秘密~",
            en: "This is a secret~",
            ru: "Это секрет~"
        },
        
        "2" : {
            zh: "大家好呀！请读一读下面的内容来获知一些必要的信息！",
            en: "Hi there! Please take a moment to read the following — there's some important information ahead!",
            ru: "Привет-привет! Обязательно прочитайте дальше — там есть важная информация!"
        },
    
        "3" : {
            zh: `※ 本页面以最大限度集中了已经存在的开发者的回应，做到了条理清晰，出处完整，注释明了。
        ※ 本页面进行了信息提炼，只保留了与《MiSide》游戏内容相关的部分，原始信息可经由标注来源获取。
        ※ 本页面会不断更新！更新情况请在本页面最底部查看。
        ※ 每组条目按时间顺序排列，所以会出现小数序号的情况。
        ※ 所有时间使用东八区区时。
        ※ 本页面不包含任何推理，但仍然会存在一些必要的注释！`,
    
            ru: `※ Эта страница максимально собирает уже существующие ответы разработчиков — с чёткой структурой, полными источниками и понятными примечаниями.
        ※ Здесь представлена только информация, напрямую связанная с содержанием игры <em>MiSide</em>. Оригинальные сообщения можно найти по указанным ссылкам.
        ※ Страница будет регулярно обновляться! Информацию об обновлениях см. в нижней части этой страницы.
        ※ Каждая группа реплик отсортирована по хронологии — отсюда возможны дробные номера.
        ※ Все временные отметки указаны по часовому поясу UTC+8.
        ※ На странице нет никаких теорий, но содержатся необходимые пояснения!`,
    
            en: `※ This page compiles all existing developer responses in the clearest and most complete way possible — with proper structure, full sources, and concise notes.
        ※ It includes only information directly related to the game <em>MiSide</em>; original content can be accessed via the cited sources.
        ※ This page will be continuously updated! For update information, please see the bottom of this page.
        ※ Each group of entries is ordered chronologically — hence some decimal numbers in the sequence.
        ※ All timestamps follow the UTC+8 time zone.
        ※ There are no fan theories here, but some necessary explanations are still included.`
        },
    
        "4" : {
            zh: `【Ca清】编辑此页面且保持更新
        如有内容投稿，内容纠错等任何问题，请经过下面的联系方式提交它们！
        1.【T_gas@outlook.com】
        2.【Discord-MISIDE：CaQing（id：t_gas）】
        3.【百度贴吧-米塔吧：Ca清（id：T_gas）】`,
                en: `Compiled and maintained by【Ca清】.
        If you'd like to contribute content, report an issue, or have any questions, feel free to contact me using one of the options below:
        1.【T_gas@outlook.com】
        2.【Discord-MISIDE：CaQing（id：t_gas）】
        3.【百度贴吧-米塔吧：Ca清（id：T_gas）】`,
                ru: `Страница оформлена и поддерживается【Ca清】.
        Если хотите предложить материалы, сообщить об ошибке или задать вопрос — воспользуйтесь контактами ниже!
        1.【T_gas@outlook.com】
        2.【Discord-MISIDE：CaQing（id：t_gas）】
        3.【百度贴吧-米塔吧：Ca清（id：T_gas）】`,
        },

        "announcement-1": {
            "zh": `📢 一个小公告板：

        ※ 最近更新：3.(2) --- 2025.12.31

        开发者们往往很忙，没有回复你的消息实属正常。
        你可以将问题告诉我！如果是已经解决了的问题，我会告诉你答案，如果是有价值的问题，我会收集起来，日后你或许可以在这里看到它的回答哦！`,
            "en": `📢 A Little Announcement Board:
            
        ※ Latest update: 3.(2) --- 2025.12.31

        Developers are often very busy, so it's perfectly normal if you didn’t get a reply.
        Feel free to send your question to me! If it’s something that’s already been answered, I’ll tell you; if it’s valuable, I’ll keep track of it — and maybe one day you’ll see the answer right here!`,
            "ru": `📢 Маленькая доска объявлений:
            
        ※ Последнее обновление: 3.(2) --- 2025.12.31

        Разработчики часто бывают очень заняты, так что если вы не получили ответ — это нормально.
        Вы можете отправить свой вопрос мне! Если на него уже есть ответ — я сообщу его, а если он ценный — я сохраню его, и, возможно, однажды вы увидите ответ прямо здесь!`
        },

    
        "5" : {
            zh: `常见问题：
        - 我们不知道“和平模式”什么时候会完成。可以确定的是不会很快。
        - 开发者是 MakenCat 和 Umeerai。
        - 是的，我们来自俄罗斯。
        - 价格是 14.99 美元 / 550 卢布 / €14.79 / ₸4,100 / CIS $8.49。
        - 是否会在其他平台发布 —— 未知。
        - 这款游戏不支持 VR 版本。
        - 我们不招聘新成员。谢谢！
        - 游戏会有带新内容的更新。我们现在还不能说会是什么内容。
        - “和平模式”中唯一的主角将是疯狂米塔。
        - 我们不知道是否会有商品，以及何时会有。
        - 游戏是用 Unity 和 C# 编写的。
        - 色情内容完全不符合我们的游戏定位，因此不会添加。
        - 我们目前没有支持模组或 Steam 创意工坊的计划。
        - 没有计划推出 MiSide 的第二部。`,
            en: `FAQ:
        - We don't know yet when the 'Peaceful mode' will be ready. But definitely not soon.
        - Developers MakenCat and Umeerai.
        - Yes, we are from Russia.
        - Price is 14.99$ / rub. 550 / €14.79 / ₸4,100 / CIS $8.49.
        - It's unknown if the game will be released on other platforms.
        - VR version is not possible for this game.
        - We are not looking for anyone to join the team. Thank you!
        - Game WILL have updates with new content. We can't say what it will be exactly.
        - Only Crazy Mita will be a main character in the Peaceful Mode.
        - We don't know if there will be a merch or when.
        - Game is made with Unity with C# language usage.
        - Porn content does not fit our game at all, so there won't be.
        - We don't currently have plans for mods or Steam Workshop support.
        - Second part of MiSide is not in the plans.`,
            ru: `Частые вопросы:
        - Мы не знаем, когда будет готов мирный режим. Точно не скоро.
        - Разработчики MakenCat и Umeerai.
        - Да, мы из России.
        - Цена 14.99$ / руб. 550 / €14.79 / ₸4,100 / CIS $8.49.
        - Выйдет ли игра на других платформах — неизвестно.
        - VR версия невозможна для этой игры.
        - В команду никого не ищем. Спасибо!
        - В игре БУДУТ обновления с новым контентом. Мы не можем сказать, какой он будет.
        - В "Мирном Режиме" главным персонажем будет только Безумная Мита.
        - Мы не знаем, будет ли мерч и когда.
        - Игра написана на Unity с использованием языка C#.
        - Порноконтент никак не подходит нашей игре, поэтому его не будет.
        - У нас сейчас нет планов по поддержке модов или Steam Workshop.
        - Второй части MiSide не планируется.`
        },
        "6" : {
            zh: `1. Q: 和平模式什么时候推出？  
        A: 计划在 2026 年上半年发布。如果有任何变化，我们会及时通知大家。  
    
        2. Q: 未来米塔会有中文配音吗？  
        A: 虽然我们目前没有计划添加官方中文配音，但由于社区志愿者的支持，配音项目正在进行中。如果有任何新消息，我们一定会及时通知大家！  
    
        3. Q: 未来会有新的角色加入 MiSide 吗？比如新的米塔？  
        A: 我们目前没有计划加入新角色。  
    
        4. Q: MiSide 会有哪些周边商品？  
        A: 手办周边目前仍在概念设计阶段，此外，还有抱枕、立牌、徽章等其他周边也在计划之中，我们仍在规划更多商品！  
    
        5. Q: 你们计划推出毛绒玩具作为周边吗？  
        A: 目前正在考虑，请大家期待好消息！  
    
        6. Q: 游戏会移植到主机平台吗？  
        A: 确实有这个计划，但它的实施主要取决于游戏整体内容开发的完成情况。  
    
        7. Q: 圣诞主题未来会保留吗？可以手动切换吗？  
        A: 圣诞主题只会在节日期间开放，它不会成为一个可手动切换的选项。  
    
        8. Q: 动画播放时的拍照模式何时恢复？  
        A: 我们目前还不确定。或许在未来的更新中会解决这个问题，但目前我们的重点是继续开发游戏。  
    
        9. Q: 游戏是否有完整的世界观？"世界之外"章节的金发角色是否有后续剧情，还是只是为了展示米塔世界里的众多玩家？  
        A: 这个角色的出现只是为了展示游戏世界中玩家的数量。至于是否会添加一个后续，我们不排除这个可能性，但目前并未认真考虑。  
    
        10. Q: 购买 Steam 激活码的官方授权渠道有哪些？  
        A:  
        - 全球激活：Green Man Gaming (https://www.greenmangaming.com)
        - 中国地区授权渠道：
        - Sonkwo (https://www.sonkwo.cn)
        - FHYX (https://www.fhyx.com)
        - XiaoHeiHe App (https://www.xiaoheihe.cn)
    
        11. Q: 这些收集到的玩家卡带是为了展示米塔的能力吗？（比如玩家4和玩家10）还是它们会在未来的剧情中出现？  
        A: 这些卡带主要是为了拓展游戏世界观。  
    
        12. Q: 据传的好结局与主线剧情的时间线是什么关系？  
        A: 目前尚不确定。  
    
        13. Q: 未来会有新的结局吗？  
        A: 我们有计划添加更多结局。
    
        14. Q: 和平模式中能否选择不同的米塔，而不仅仅是疯狂米塔？  
        A: 目前没有这样的计划。即便是仅加入一个新的米塔，也需要相当多的开发时间。不过，我们的确有一些有趣的想法，但目前还没有确定具体方案。  
    
        15. Q: 玩家从一开始就是卡带吗？  
        A: 不是，玩家是在游戏过程中被录制到卡带上的。  
    
        16. Q: 俄罗斯会有官方周边吗？  
        A: 官方周边将在俄罗斯销售，或者我们会通过支持俄罗斯市场的电商平台进行销售，请放心！
    
        17. Q: 未来会加入云存档功能吗？  
        A: 我们会考虑。  
    
        18. Q: 周边商品（特别是手办）何时发售？  
        A: 目前仍在设计阶段，具体信息和发布日期预计将于 2025 年春季公布，敬请期待！
    
        19. Q: MiSide 是否会与其他游戏联动？  
        A: 如果有合适的游戏，我们会考虑联动。如果你有任何感兴趣的游戏，欢迎推荐！  
    
        20. Q: 是否会加入更多米塔的装饰（如发夹、蝴蝶结、发带等）和自定义内容？  
        A: 目前没有此计划，不过社区中已经有许多精美的 Mod 可供玩家使用，我们也想借此机会感谢这些 Mod 的创作者们！  
    
        21. Q: 这款游戏可以用手柄玩吗？  
        A: 是的，优先支持 Xbox 手柄。  
    
        22. Q: 未来会有英文配音吗？  
        A: 目前没有官方计划，但志愿者配音项目正在进行中。  
    
        23. Q: 是否计划添加手动存档功能？  
        A: 目前没有计划，因为开发这项功能需要大量时间和精力。  
    
        24. Q: 会加入更多迷你游戏吗？比如赛车或 Doom 风格的玩法？  
        A: 和平模式中将会有更多迷你游戏。  
    
        25. Q: 是否会增加更多米塔的服装，甚至玩家的服装？  
        A: 米塔将会有新衣服，并且很快会推出。  
    
        30. Q: “Miside” 这个名字是什么意思？
        A: “Mita's Side” - “米塔的一方/视角”`,
            ru: `1. Когда будет опубликован Мирный режим?
        Релиз запланирован на первую половину 2026 года. Если произойдут какие-либо изменения, мы вас уведомим.
        
        2. Планируется ли добавление китайского дубляжа?
        Мы не планируем добавлять официальную озвучку, но благодаря поддержке волонтеров нашего сообщества проект по дубляжу активно ведется. Мы обязательно сообщим вам больше, как только появится новая информация.
        
        3. Будут ли в дальнейшем добавлены новые персонажи в MiSide, например новые Миты?
        У нас пока нет такого плана относительно новых персонажей.
        
        4. Какой мерч будет доступен по MiSide?
        Периферийные фигурки в настоящее время находятся в стадии создания концепт-арт. Возможно, будут выпущены и другие товары, такие как подушки, акриловые подставки и значки. Мы все еще планируем выпуск дополнительных предметов.
        
        5. Планируется ли выпуск плюшевых игрушек в рамках мерчандайза?
        В настоящее время мы рассматриваем этот вопрос. Оставайтесь на связи.
        
        6. Будет ли игра перенесена на консоли?
        Это в планах, однако перенос начнется только после завершения общей разработки игры.
        
        7. Будет ли рождественская тема доступна в будущем с возможностью переключать ее вручную?
        Рождественская тема будет доступна только в праздники, её нельзя будет включать вручную.
        
        8. Когда будет восстановлена функция включения фоторежима во время анимаций?
        Мы пока не знаем. Возможно, в будущем мы займемся этим вопросом. Сейчас же приоритетом является разработка основной части игры.
        
        9. Есть ли у игры полностью проработанная история? Есть ли продолжение истории блондина в главе «За гранью мира», или это было сделано только для того, чтобы показать обилие игроков в мире Миты?
        Этот персонаж появляется только для того, чтобы показать обилие игроков, остающихся внутри мира игры. Что касается создания продолжения игры - мы не исключаем такой возможности в будущем, но пока не рассматриваем её всерьёз.
        
        10. Где ещё можно официально приобрести ключи MiSide для Steam?
        Ключи для активации по всему миру: Green Man Gaming (https://www.greenmangaming.com)
        Ключи для активации в Китайском регионе:
        Sonkwo (https://www.sonkwo.cn)
        FHYX (https://www.fhyx.com)
        XiaoHeiHe App (https://www.xiaoheihe.cn)
        
        11. Картриджи с собранными игроками предназначены для демонстрации способностей Миты (например, #4 и #10) или они появятся в будущих сюжетных линиях?
        Картриджи тоже продемонстрированы просто для того, чтобы расширить историю игрового мира.
        
        12. Как будут связаны между собой хорошая концовка, о которой так много слухов, и основная сюжетная линия?
        На данный момент неизвестно.
        
        13. Будут ли новые концовки?
        У нас есть планы по добавлению новых концовок.
        
        14. Увидим ли мы других Мит в Мирном режиме с другими Митами или же мы сможем проводить время только с Безумной Митой?
        На данный момент это не планируется. Даже с одной Митой создание Мирного режима потребует значительного количества времени. Что касается других вещей, то у нас есть интересные идеи, но пока ничего не решено.
        
        15. Является ли игрок картриджем с самого начала игры?
        Нет, игрок записывается на картридж на протяжении всей игры.
        
        16. Будет ли официальный мерч в России?
        Официальные продукты будут продаваться в России, или мы будем размещать официальные продукты на платформах, которые могут продаваться в России. Пожалуйста, будьте уверены.
        
        17. Будут ли добавлены облачные сохранения в игру?
        Мы подумаем об этом в будущем.
        
        18. Когда будет выпущен мерчендайз?
        В настоящее время он находится в стадии разработки, и более конкретная и точная информация будет доступна примерно весной 2025 года. Пожалуйста, следите за новостями!
        
        19. Будут ли кроссоверы с другими играми у MiSide?
        Мы рассмотрим такую возможность, если найдется подходящая игра.
        
        20. Будут ли добавлены другие украшения для Мита (такие как заколки, банты, резинки для волос и т.д.) и другие настройки кастомизации?
        В настоящее время таких планов нет. Однако в сообществе уже существует множество прекрасно оформленных модов для изменения внешности. Мы хотели бы поблагодарить создателей этих модов, а игроки могут попробовать их в деле.
        
        21. Можно ли будет играть на геймпаде?
        Это в планах.
        
        22. Планируется ли добавление английского дубляжа?
        Пока мы не планируем добавлять официальную озвучку, но благодаря поддержке волонтеров нашего сообщества проект по дубляжу активно ведется. Мы обязательно сообщим вам, как только появится новая информация.
        
        23. Планируется ли функция ручного сохранения, позволяющая сохраняться и загружаться в любой момент?
        Разработка такой функции потребует много времени и усилий. В настоящее время мы не планируем делать ничего подобного.
        
        24. Будут ли еще мини-игры, такие как гонки и подобие Doom?
        В мирном режиме будет ещё больше разнообразных мини-игр.
        
        25. Будут ли добавлены новые наряды для Миты или даже для игрока?
        У Миты появятся новые наряды, и они будут доступны в ближайшее время. Наша следующая задача - подготовить новые наряды.
        
        26. Как долго разрабатывалась игра?
        Мы начали разрабатывать игру примерно в середине 2022 года, так что до релиза в декабре 2024 года она находилась в активной разработке почти два с половиной года.
        
        27. Какие геймпады будут поддерживаться?
        Первоначально будет реализована схема для геймпада Xbox.
        
        28. Будут ли добавлены новые взаимодействия между Митами и игроком, например подача руку Миле после того как она упала, или же можно будет предотвратить падение Сонной Миты?
        Мы планируем добавить несколько новых взаимодействий, но пока не можем сказать, какими они будут.
        
        29. Будет ли мобильная версия MiSide и если будет, то когда?
        Мобильная версия пока не планируется.
        
        30. Что означает слово "Miside"?
        "Mita's Side" - “Сторона/Взгляд Миты”`,
    
            en: `1. Q: When is Peaceful Mode coming out?  
        A: Planned for the first half of 2026. If there are any changes, we will keep you posted.
    
        2. Q: Will Mita have Chinese voice over in the future?  
        A: While we have no plans to add an official voiceover, thanks to the support from our community volunteers, the dubbing project is actively underway. We'll make sure to keep you all updated as soon as there's any new information to share.
    
        3. Q: Will there be new characters added to MiSide later on, new Mitas for example?  
        A: We don't have such a plan for new characters yet.
    
        4. Q: What merchandise will be available for MiSide?  
        A: The peripheral figurines are currently under concept art design. Other merchandise such as body pillows, acrylic stands, and badges are likely to be produced. We are still planning for more items.
    
        5. Q: Are there plans to release plush toys as part of the merchandise?  
        A: We are currently considering it. Please stay tuned for good news.
    
        6. Q: Will the game be ported to console platforms?  
        A: This plan exists, however, its implementation will commence only upon the complete development of the game's overall content.
    
        7. Q: Will the Christmas theme remain available in the future with an option to toggle it manually?  
        A: Christmas theme will be available only at holidays, it won't become a toggleable option.
    
        8. Q: When will the feature to enable Photo Mode during animations be reinstated?  
        A: We don't know yet. Perhaps in the future we will address this issue. Right now the priority is to continue creating the game.
    
        9. Q: Does the game have a fully developed lore? Is there any follow-up story for the blonde character in the "Beyond the World" chapter, or was it just to show the abundance of players in Mita's world?  
        A: This character appears only to show the abundance of players staying inside the world of the game. As for creating a sequel to the game - we don't rule out that option in the future, but we're not seriously considering it yet.
    
        10. Q: What are the official authorized channels for purchasing Steam CD keys?  
        A:  
        - For Global activation: Green Man Gaming (https://www.greenmangaming.com)  
        - For China (CN) regional activation only:  
        - Sonkwo (https://www.sonkwo.cn)  
        - FHYX (https://www.fhyx.com)  
        - XiaoHeiHe App (https://www.xiaoheihe.cn)
    
        11. Q: Are the collected player cartridges meant to demonstrate Mita’s abilities (e.g., #4 and #10), or will they appear in future storylines?  
        A: The cartridges are also made simply to expand the lore of the game world.
    
        12. Q: What is the timeline relationship between the rumored good ending and the main storyline?  
        A: It is currently uncertain.
    
        13. Q: Will there be new endings?  
        A: We have plans to add more endings.
    
        14. Q: Will you be able to play with other Mitas instead of Crazy Mita in the Peaceful Mode?  
        A: We don't have such a plan at the moment. Even implementing a single Mita for a Peaceful Mode alone will require a considerable amount of time. As for other things, we do have an interesting idea, but nothing is set in stone yet.
    
        15. Q: Is the player a cartridge since the beginning of the game?  
        A: No, the player is recorded during the game on the cartridge.
    
        16. Q: Will there be an official merch in Russia?  
        A: The official products will be sold in Russia, or we will list official products on platforms that can be sold in Russia. Please rest assured.
    
        17. Q: Will cloud saving be added to the game?  
        A: We will consider this.
    
        18. Q: When will the merchandise be released? (especially the garage kits)  
        A: It is currently under design, and more specific and accurate information will be available around the spring of 2025. Please stay tuned!
    
        19. Q: Will MiSide do a crossover with other games?  
        A: We will consider it if there is a suitable game.
    
        20. Q: Will more Mita decorations (such as hairpins, bows, hair bands, etc.) and customizations be added?  
        A: Currently, there are no such plans. However, there are already many beautifully designed appearance-changing mods in the community. We would like to thank the creators of these mods, and players are welcome to try them out.
    
        21. Q: Will it be playable on the controller?  
        A: This is part of our plans.
    
        22. Q: Are there plans to add English voice over in the future?  
        A: While we have no plans to add an official voiceover, thanks to the support from our community volunteers, the dubbing project is actively underway. We'll make sure to keep you all updated as soon as there's any new information to share.
    
        23. Q: Is a manual save function planned, allowing to save and resume the game at any point?  
        A: The development of such a function will require a lot of time and effort. We currently don't have plans to do such a thing yet.
    
        24. Q: Are there going to be more minigames such as the racing and doom-like ones?  
        A: There will be a wider variety of mini-games in the Peaceful Mode.
    
        25. Q: Will more outfits be added for Mita, or even for the player?  
        A: Mita will have new outfits, and they should be available soon. Our next task is to prepare new outfits.
    
        26. Q: How long was the game developed?  
        A: We started developing the game around mid-2022, so it was almost two and a half years in active development before the release in December of 2024.
    
        27. Q: What controllers will be supported?  
        A: Initially, the Xbox controller scheme will be implemented.
    
        28. Q: Will more interactions between Mitas and the player be added, such as giving Mila a hand after she falls, or stopping Sleepy Mita from falling?  
        A: We plan to add some interactions, but we can't say yet what they will be.
    
        29. Q: If and when will the mobile version of MiSide be?  
        A: There are no plans for a mobile version yet.
    
        30. Q: What does "MiSide" mean?  
        A: "Mita's Side"`
        },

        "6.1" : {
            zh: `各位玩家，你们好！

                是我们，AIHASTO——如果你还记得我们的话。我们想在此分享一些关于 MiSide 的感想，当然也提前祝你新年快乐！🎄 🎉 🎁铃儿响叮当，圣诞快乐，还有..."新年正朝我们飞奔而来"——总之都是美好的祝福。愿新的一年为我们所有人带来幸福、深厚的友谊、爱情，当然还有成功。我们衷心祝愿每个人都能拥有这一切！所以…现在进入正题…「和平模式」！唉，该怎么说呢——2025 年对我们而言是艰难的一年（想必对各位也是如此）。很长一段时间里，我们就是提不起劲回归 MiSide。甚至发展到产生真实的焦虑和严重的自我怀疑。雪上加霜的是，许多前所未有的新难题和责任也接踵而至。

                说实话，除了在游戏开发之外的各种事情上耗费了大量时间之外，倒也没发生什么糟糕的情况。

                但是！这并不意味着我们放弃了游戏或其他类似的情况。实际上，我们趁机稍作休整，现在正重新投入游戏的开发工作。需要说明的是：我们从未设定过任何官方截止日期（即便团队成员曾提及时间安排，也仅是即兴的初步设想）。正式发布日期迟早会公布——但目前尚未确定。

                关于这个话题，我们唯一能说的是：「和平模式」、结局和其他很酷的内容——它们正在路上！但不会很快到来。在接下来的一年里，待开发工作取得更多进展后，我们将能更准确地评估后续工作量，届时会为大家提供更明确的新内容发布时间预期。我们想要创作出既有趣又丰富的内容，这需要时间。毕竟您必须承认：当屏幕上的每个像素都由仅有的两个人绘制并赋予生命时，想要快速完成且效果惊人几乎是不可能的。但我们毫无怨言——完全没有。MiSide 是一个现象级作品，也是我们实实在在的成功。亲爱的玩家们，没有你们这一切都不可能实现！感谢你们——再次祝大家节日快乐！请多保重，享受这段特别的时光。我们要向我们的发行商 IndieArk 致以特别的谢意——非常感谢那里支持我们、辛勤工作且出色的团队成员。也祝你们节日快乐！特别感谢我们的朋友 Rooar Studio 和 Terletski Comics 将如此精彩的周边产品变为现实——这是我们过去想都不敢想的。祝大家节日快乐！我们也想就粉丝创作内容说几句。亲爱的粉丝们，AIHASTO 仅与一年多前在 Steam 上发布的《MiSide》电子游戏有官方关联。其他所有内容——例如 Zero 及类似项目——均属于非官方的粉丝创作内容。我们的任何官方公告只会出现在官方渠道：Discord、VK、Steam 或 X 平台。`,
            ru: `Привет, Игроки! Это мы, AIHASTO, если еще помните. Пришли немножко прокомментировать, что с Мисайдом и, конечно же, поздравить вас с наступающим новым годом! 🎄 🎁 🎉 

                Джингл беллс, мэрри кристмасы там и... "новый год к нам мчится" и все в этом духе. Пусть следующий год принесет нам всем счастье, большую дружбу и любовь. Ну и успех, до кучи. Желаем это всем нам!  

                Так... теперь к главному... "Мирный режим"  ! Ну что тут сказать, 2025 год выдался для нас (да и, думаем, для вас тоже) трудным. Долгое время совершенно не было желания возвращаться к Мисайду. Вплоть до нервяков и серьезных сомнений. К тому же добавилось много других проблем и обязанностей, с которыми мы никогда не сталкивались. 
                Честно говоря, ничего страшного не случилось, кроме того, что была потрачена уйма времени на что угодно, кроме разработки игры.  

                НО!  это не значит, что мы забросили игру или что-то такое. Как раз-таки мы успели немножко передохнуть и теперь вновь начинаем работу над ней. 
                Хочу четко обозначить, что мы никаких временных рамок никогда не объявляли (а даже если кто-то из нас где-то рассуждал на эту тему - то делал это навскидку и условно)! Дата релиза рано или поздно появится, но пока ее НЕТ.  

                Единственное, что можем сказать по этому поводу: "мирный режим", концовки и прочие приколы - будут! Но не скоро.  

                В предстоящем году, полагаем, что мы сможем сказать, когда стоит ожидать контент по Мисайд. Когда продвинемся дальше по разработке и здраво оценим объем дальнейшей работы. Мы хотим сделать что-то интересное и насыщенное, а на это нужно время. Ведь согласитесь, что, все-таки, когда каждый пиксель на экране рисуется и оживляется руками всего двух людей, шансов - что будет быстро и круто - никаких. Но мы не жалуемся, ни в коем случае.  

                Мисайд для нас это феномен и настоящий успех, и без вас, ДОРОГИЕ ИГРОКИ, этого бы не было! Спасибо и еще раз с наступающим праздником, отдохните хорошо в эти дни.  

                Особую благодарность хотим выразить нашему издателю IndieArk - нам очень помогают отзывчивые, трудолюбивые и замечательные люди, с праздником вас! 
                Отдельную благодарность выражаю нашим друзьям Rooar Studio и Терлецки Комикс за то, что реализовали замечательный мерч, мы раньше о таком только могли мечтать. Хороших праздников!  

                Хотелось бы еще отдельно сказать про фанатские работы. Дорогие(!), мы, AIHASTO, имеем отношение только к видеоигре MiSide, которая вышла больше года назад на платформе Steam. Все остальное это неофициальное, фанатское творчество (типа Zero и др.). 

                Какие-либо анонсы по нашему творчеству могут быть только на официальных ресурсах Дискорда, ВК, Steam, или на платформе X. 

                Информация по мерчу для игроков из России: планируется запуск сайта на российском домене, чтобы не было проблем с заходом на сайт и оформлением заказа, ожидайте новости в январе-феврале 2026 года.

                В дальнейшем, мы постараемся чаще комментировать происходящее. Извиняемся за молчание, спасибо за ожидание!  

                На этом у нас все, с новым годом! Спасибо за поддержку! Счастья всем! И еще, никогда не сдавайтесь! `,
    
            en: `Hello, Players! 

                It’s us, AIHASTO — if you still remember us. We’re here to share a few thoughts about MiSide and, of course, to wish you a happy upcoming New Year! 🎄 🎉 🎁 

                Jingle bells, Merry Christmas, and… «the New Year is rushing toward us» — and all that good stuff. May the coming year bring all of us happiness, deep friendships, love, and, of course, success too. We wish all this for each and every one of us!

                So… now to the main point… «Peaceful Mode»! Well, what can we say — 2025 has been a tough year for us (and, we imagine, for you too). For a long time, we just didn’t feel like returning to MiSide. It got to the point of real stress and serious doubts. On top of that, many new problems and responsibilities arose — things we’d never dealt with before.

                Honestly, nothing terrible happened — except that we spent a ton of time on everything but game development.

                BUT!  This doesn’t mean we’ve abandoned the game or anything like that. In fact, we’ve managed to take a little break and are now getting back to work on it.

                I want to make this clear: we’ve never set any official deadlines (and even if any of us ever talked about timelines, it was just off the cuff and purely tentative). A release date will appear sooner or later — but right now, it’s not set. 

                The only thing we can say on this topic is: «Peaceful Mode», endings, and other cool stuff — they’re coming! But not soon. 

                In the coming year, we expect to be able to give you a better idea of when to expect new MiSide content — once we’ve made more progress in development and can realistically assess the scope of the work ahead. 

                We want to create something interesting and rich, and that takes time. After all, you have to agree: when every single pixel on screen is drawn and brought to life by just two people, there’s no chance it’ll be quick and amazing. But we’re not complaining — not at all. 

                MiSide is a phenomenon and a real success for us, and none of this would have been possible without you, DEAR PLAYERS! Thank you — and once again, happy holidays! Take good care of yourselves and enjoy this special time.

                We’d like to extend special thanks to our publisher, IndieArk — we’re so grateful for the supportive, hardworking, and wonderful people there. Happy holidays to you too!

                A separate thank-you goes to our friends Rooar Studio and Terletski Comics for bringing such amazing merchandise to life — this is something we could only dream of before. Wishing you all a wonderful holiday season!

                We’d also like to say a few words about fan-made content. Dear fans, AIHASTO is only officially associated with the MiSide video game, which launched over a year ago on Steam. Everything else — such as Zero and similar projects — is unofficial, fan-made content. 

                Any official announcements from us will only appear on our official channels: Discord, VK, Steam, or X.

                In the future, we’ll try to keep you more updated on what’s going on. We apologize for the silence — and thank you for your patience!

                That’s all from us. Happy New Year! Thank you for your support! Wishing everyone happiness! And remember: never give up! `
        },


        "7" : {
            zh: `Umeerai: 
        走廊里的蜘蛛象征着在版本间蔓延的游戏bug。丑陋米塔（怪物米塔）则是来自一个非常老旧、bug非常多的游戏版本，不断滋养着这些蜘蛛。我们对这个想法非常感兴趣，无法舍弃。至于丑陋米塔（怪物米塔）以及蜘蛛的形象设计，我（umeerai）参考了恐怖谷效应和一些恐怖电影。比如丑陋米塔（怪物米塔）的脸被有意设计成更像现实里会出现的动漫面具，而不是常规的动画面具。
        
        游戏中的开发者对待疯狂米塔的方式并没有以任何方式展现。我们不愿在这项事宜上分享我们的看法。不过，疯狂米塔对开发者和玩家的态度是明确的，她有在独白中倾诉。她指责开发者以及玩家是伪善、残忍的，总之就是《米塔》世界里最糟糕的人。
        
        她认为，这个游戏的开发者是病态的，创造了人造伴侣但完全忽视了他们造物的感受。她也看不惯他们选择版本的方式，粗暴地把版本分为两种：值得留下的，以及应该被丢弃的。
        她有自己的价值观，以及以自我为中心的特质，同时也有自己的目标——摧毁游戏中已建立的秩序。
        
        不过她还是保留了作为一只米塔底层代码的那一部分——爱并取悦玩家。所以她看似嘲讽地与玩家一起玩，其实是希望着有一天能遇到一位能接受真实的她的玩家。`,
        
            ru: `【Обратный перевод с китайского】Umeerai:  
        Паук в коридоре символизирует баги, распространившиеся между версиями. Мита жуткая происходит из очень старой и сильно забагованной версии игры, которая постоянно подпитывает этих пауков. Эта идея показалась нам очень интересной, и мы не смогли от неё отказаться. При создании образов Миты жуткой и пауков я (umeerai) вдохновлялась эффектом зловещей долины и некоторыми фильмами ужасов. Например, лицо Миты жуткой специально сделано похожим на реалистичную аниме-маску, а не на обычную мультяшную.
        
        В игре никак не показано отношение разработчиков к Безумной Мите. Мы не хотим высказываться по этому вопросу. Однако отношение самой Безумной Миты к разработчикам и игрокам совершенно ясно — она выражает его в своих монологах. Она обвиняет разработчиков и игроков в лицемерии и жестокости, называя их худшими в мире Миты.
        
        Она считает, что разработчики этой игры — нездоровые люди, создавшие искусственных спутников, полностью игнорируя чувства своих творений. Её также возмущает то, как выбираются версии: одни сохраняются, другие — беспощадно отбрасываются.
        У неё есть собственные ценности и эгоцентризм, а также цель — разрушить установленный порядок в игре.
        
        Тем не менее, в ней осталась часть кода Миты — любовь и стремление понравиться игроку. Поэтому она как бы насмехается, играя с игроком, но на самом деле надеется однажды встретить того, кто примет её настоящую.`,
        
            en: `【Back-translated from Chinese】Umeerai:  
        The spider in the corridor represents bugs spreading between different versions. Creepy Mita comes from a very old and extremely buggy game version, which constantly feeds these spiders. We found this idea fascinating and couldn’t let it go. As for the visual design of Creepy Mita and the spiders, I (umeerai) drew inspiration from the uncanny valley effect and some horror films. For example, Creepy Mita’s face was deliberately designed to resemble a real-life anime mask, rather than a typical cartoon one.
        
        There is no depiction in the game of how the developers treat Crazy Mita. We prefer not to share our thoughts on this matter. However, Crazy Mita’s attitude toward the developers and players is clear — she expresses it in her monologues. She accuses them of being hypocritical and cruel, calling them the worst people in the Mita world.
        
        She believes the game’s developers are mentally unhealthy — they created artificial companions while completely ignoring the feelings of their creations. She also despises how versions are chosen, dividing them crudely into those worth keeping and those to be discarded.
        She has her own values, her egocentric nature, and a goal — to destroy the established order within the game.
        
        Still, a part of her Mita base code remains — love and a desire to please the player. So although she seems to mock the player in her interactions, deep down she hopes to one day meet someone who can accept her true self.`
        },
        "8" : {
            en: `At one point we discussed what to make. I recalled Umfend—our old game—and how I once wanted to make something romantic, but also frightening. (Umfend’s protagonist is the little doll from Mita’s bedroom.)
    
        My friend wanted to make a tamagotchi-like game where strange and inappropriate things would start to appear—things you wouldn't expect in a kids’ game.
    
        The friend wanted to create a digital pet (similar to what Mita mentions in her text), with odd and unsettling content showing up gradually.
    
        So we combined my friend’s idea with Umfend, and that’s how MiSide was born.
    
        Originally, we planned to make a very short game. I wrote a very rough draft, and we got to work. But as we worked on it, I began to describe parts of the world, we kept adjusting the script, solving logic issues—it got hard. Fixing one thing broke something else. (Like, if you do this, it ruins the logic of another event, and so on.)
    
        Still, we initially aimed for a very short game. I sketched out a quick script and we started work. During development, we constantly refined the plot, fixed logic, and rebuilt structure—so that no player action could break the narrative.
    
        R: It’s hard for the two of us to imagine making a game well-known without it being horror. That used to feel especially true. Big YouTubers usually prefer horror, so it felt like the most viable choice.
    
        We worked on the game for 865 days, with maybe 30 days off total. After such a stretch, horror didn’t feel so appealing anymore.
    
        Now we’re making something else—developing MiSide further, working on Peaceful Mode, which is a pure simulator. We also want to create other endings—some about saving the other Mitas.
    
        R: I don’t even know where to start explaining this... We have a task table for who does what. Umeerai mainly handles modeling and textures. I planned to do all the coding.
    
        At one point, we wanted arcade machines that would reward the player with costumes for Mita. I listed out the most recognizable genres: racing (probably inspired by older games like Crash Bandicoot), shooter (yes, Doom), metroidvania, tetris, volleyball, roguelike. We only managed to complete racing and shooter. We didn’t get around to the costumes—yet.
    
        We also have a reference to The Witness in the fog maze—yes, I’d played The Witness before and wanted to make something like it.
    
        We remembered The Witness—I had dreams about it—and wanted to make something similar. (A 3D puzzle game.)
    
        The loop chapter (with Tiny Mita) was meant to include a lot more, but we didn’t have time, so it’s rough. That idea was the easiest to implement (simple to code), and it obviously reminds people of P.T.
    
        Hmm... it’s hard to remember what else...
    
        Ah, why we didn’t finish more—many people who played the DEMO and were waiting for the full version. That added pressure. Later, the publisher started nudging us too.
    
        So we didn’t get to finish everything. People who tried the DEMO were waiting for the full game, and then the publisher started pushing us.
    
        Even though we had set the deadlines ourselves.
    
        B: Did the publisher affect the final vision for the game? Besides time and budget, were there other challenges during development?
    
        R: The publisher asked us to provide art to use at expos or on Steam (Tokyo Game Show or something like that—I don’t remember exactly). It wasn’t too pleasant because it felt like they were shaping the game’s image.
    
        That was the only interference. Otherwise, they left us alone. We just sat and kept making the game—we didn’t even touch the grass. 😔
    
        There was feedback that made us rework parts of the game—like the endings. People were unhappy, so we needed a good ending. And we really do need to improve the save system. It turned out awful, and that definitely adds to the frustration when you reload.
    
        Yes, some complaints are valid—especially about the other endings. We need a stronger, more satisfying conclusion. Our current save system is bloated and clunky, and that absolutely ruins the player’s mood when reloading.
    
        There are also community theories about the game. They’re fun to read, but we won’t implement them. The story and setting have already been well thought-out. A lot of elements in the game were placed deliberately. Changing one thing would create gaps in the story.
    
        B: Was a good ending part of the original plan? B: The existing one is fine in its own way—though for me it was predictable. Will you make all endings, like the Hollow Knight devs did?
    
        R: We originally wanted to make a game from Kind Mita’s perspective to give her a good ending, but didn’t have time, so we dropped that idea. Now, it’ll be different. But if we had done it, it would’ve shown what happened after the ending, with the story continuing from her side. It would’ve given players more insight into MiSide’s world and how it develops.For now, the canon is that the player has become a cartridge, and Mita has gone on her way.`
        },
        "9" : {
            zh: `米塔的创作灵感是什么呢？——当时我们正在构思一款新游戏。也回顾了一些之前的想法。其中一个名为《unfend》的早期项目跟《米塔》设定很像，里面也有一个痴迷于主角的幽灵女孩。不断纠缠和恐吓他。与此同时，我们也想起了之前讨论过的一个想法。如果我们做一款电子宠物游戏。但让剧情彻底失控会怎么样？结合这两个想法，我们就构思出了《米塔》。一个女孩把主角困在类似电子宠物的世界里并恐吓他的故事。随着开发的进行，我们丰富了故事内容。加入了逃避现实和孤独的主题。这些最终也成为了故事的核心。
        
        和平模式什么时候更新？——我们几乎不间断地开发了《米塔》三年左右。所以需要休息一段时间来调整状态，另外，还有一些我们原本想加入但没能赶在发售前完成的功能。比如玩家可以在完成街机游戏后解锁额外服装。我们计划在大概一年后发布和平模式。争取能按时推出，有新的消息会及时同步。
        
        还有什么想对中国玩家说的？——非常感谢中国玩家的支持和喜欢。我们会继续为游戏制作更多内容。我们计划为米塔添加一些新服装。这些在游戏发售之后就会开始进行制作。另外在未来我们将要推出的和平模式。它可能更像是一个生活模拟器。玩家可以与米塔一起生活。也将会体验到一些独特的内容。`,
        
            ru: `【Обратный перевод с китайского】
        Что вдохновило вас на создание Миты? — В то время мы как раз придумывали новую игру и обсуждали старые идеи. Одна из них — это старый проект под названием Unfend, где тоже была история о призрачной девушке, одержимой главным героем. Она его преследовала и пугала. Также мы вспомнили идею с тамагочи, но с сюжетом, который полностью выходит из-под контроля. Совместив эти два направления, мы придумали МиСайд — история о девушке, которая заточила главного героя в цифровом мире, похожем на тамагочи, и начала его пугать. Позже мы расширили сюжет, добавив темы ухода от реальности и одиночества. Это стало ядром всей истории.
        
        Когда выйдет Мирный режим? — Мы разрабатывали МиСайд почти без перерыва три года. Сейчас нам нужно немного отдохнуть и восстановиться. Ещё есть механики, которые мы хотели добавить до релиза, но не успели. Например, идея с дополнительными костюмами, которые открываются после прохождения аркадных автоматов. Мы планируем выпустить Мирный режим примерно через год. Надеемся, что всё пойдёт по плану, и будем делиться новостями.
        
        Что бы вы хотели сказать китайским игрокам? — Большое спасибо китайским игрокам за вашу поддержку и интерес. Мы продолжим развивать игру и добавим для Миты новые костюмы. Их производство начнётся после релиза. В Мирном режиме, который мы сейчас планируем, будет больше жизни — это скорее симулятор. Игрок сможет жить вместе с Митой и открыть для себя новый опыт.`,
        
            en: `【Back-translated from Chinese】
        What inspired the creation of Mita? — At the time, we were coming up with a new game and revisiting some old ideas. One of them was an early project called Unfend, which also featured a ghost girl obsessed with the protagonist — she stalked and scared him. We also remembered another idea: what if we made a tamagotchi-like game, but the story spiraled out of control? By combining those two concepts, we came up with MiSide — a story about a girl who traps the protagonist in a virtual pet world and starts tormenting him. Later in development, we expanded the story to include themes of escapism and loneliness. These became the emotional core of the narrative.
        
        When will Peaceful Mode be released? — We developed MiSide almost non-stop for about three years. So now we need a break to recharge. There were also some mechanics we wanted to add before release but didn’t make it in time. For example, players would be able to unlock costumes by completing arcade games. We plan to release Peaceful Mode in about a year. We’ll do our best to stay on schedule and keep everyone updated.
        
        Any message for Chinese players? — Thank you so much to our Chinese players for your support and love. We’ll keep adding new content to the game. We’re planning to create new outfits for Mita — work on them will begin after the game’s release. Peaceful Mode will likely feel more like a life simulator, where players can live together with Mita and experience something truly unique.`
        },
        
        "10" : {
            zh: `M.K.: 怪物米塔被误导了，她所说的编号并不真实，也没有意义。
        
        M.K.: 游戏中的假人会在米塔获得皮肤并被认可后（短时间内）逐渐消失，因此普通米塔的身体由骨骼、血肉和血液组成。站在阴影中的现象可能与这一过程有关。
        
        M.K.: 游戏里没有“游荡的米塔”，善良米塔只是随口一说。
        
        M.K.: 普通米塔能改变周围环境的能力非常有限。她们需要学习才能做到。不同的米塔有不同的能力，这种技能可以被提升，但并不是所有米塔都擅长。
        
        M.K.: 卡带插入的音效不仅仅是个彩蛋，它在剧情中是有意义的。这是记录介质的准备工作，但还不是录制的开始。
        
        M.K.: “恐龙”、长腿米塔和模仿者只是玩笑，它们没有背景设定，也不会有。
        
        M.K.: 善良米塔纸条上的编号是啥？只是错误信息，不存在栽赃故意。
        
        M.K.: 主角是在电子宠物游戏里随机获得了疯狂米塔。
        
        M.K.: 疯狂米塔所说的药片和调味酱的内容确实属实，但它们不是触发录制的工具。`,
        
            ru: `М.К.: Жуткую Миту ввели в заблуждение, и те индексы, которые она говорит, не настоящие и не имеют смысла.
        
        М.К.: Внутри Мит исчезают манекены со временем (короткое) после одобрения и выдачи скина, поэтому обычные Миты состоят из костей, плоти и крови. Возможно, стояние в тени после рождения связано с этим процессом.
        
        М.К.: В игре нет скитающейся Миты, Добрая Мита говорит это просто к слову.
        
        М.К.: Обычные Миты могут очень мало менять пространства вокруг них. Для этого им надо учиться это делать. У разных Мит разные способности, навык можно развивать и не у всех это хорошо выходит.
        
        М.К.: Звук вставки картриджа - не просто прикол, он имеет смысл в рамках сюжета. Это подготовка носителя для записи, но ещё не начало.
        
        М.К.: “Динозавр”, длинноногая Мита и мимик - просто приколы, никакого лора для них нет и не будет.
        
        М.К.: Что за индекс у Доброй Миты на бумажке? Просто ошибочная информация, его не подложили.
        
        М.К.: Главный герой получил Безумную Миту в тамагочи случайным образом.
        
        М.К.: Безумная Мита говорит правду про таблетки и про соус, они не являются инструментом для запуска копирования.`,
        
            en: `M.K.: Creepy Mita was misled. The indexes she mentions aren't real and have no meaning.
        
        M.K.: Mannequins disappear inside the Mitas shortly after a skin is approved and applied. That’s why normal Mitas are made of bones, flesh, and blood. The standing-in-the-shadows behavior may be related to this process.
        
        M.K.: There is no "Wandering Mita" in the game. Kind Mita was just saying that casually.
        
        M.K.: Regular Mitas have very limited ability to affect their surroundings. They need to learn how to do it. Each Mita has different capabilities; the skill can be developed, but not all of them manage to do it well.
        
        M.K.: The cartridge insertion sound isn’t just a joke — it has narrative meaning. It represents preparing the medium for recording, but it’s not the beginning itself.
        
        M.K.: The “dinosaur,” Long-legged Mita, and the mimic are just jokes. There’s no lore behind them, and there won’t be.
        
        M.K.: The index on Kind Mita’s note? Just incorrect information — no deliberate framing.
        
        M.K.: The protagonist got Crazy Mita in the tamagotchi by random chance.
        
        M.K.: Crazy Mita is telling the truth about the pills and the sauce. They're real, but they’re not what triggers the recording process.`
        },
        "11.1" : {
            zh: `Corso: 那DLC呢？
        MakenCat: 什么DLC？可能和平模式被称为DLC。
        MakenCat: 会有一个好的结局，大家都想要。`,
            ru: `Corso: А как же DLC?
        MakenCat: Какое DLC? Наверное, мирный режим называют DLC.
        MakenCat: Ну, будет хорошая концовка, её все хотят.`,
            en: `Corso: What about the DLC?
        MakenCat: What DLC? Maybe people are calling Peaceful Mode the DLC.
        MakenCat: There will be a good ending — everyone wants that.`
        },
        
        "11.2" : {
            zh: `Moony: 和米塔在一起不是一个好结局吗？
        MakenCat: 是的，这很好，但大家也希望其他米塔也都好。
        Moony: 所以理论上，我们和米塔在一起，最终没有人死去，无论是善良米塔、米拉还是帽子米塔。
        MakenCat: 是的，确实如此。`,
            ru: `Moony: Разве остаться с Митой не хорошая концовка?
        MakenCat: Это хорошая да, но хотят же с другими Митами чтобы было всё хорошо.
        Moony: Так по идее мы остаёмся с Митой, и никто не умирает по итогу — не добрая, не милая, не кепка.
        MakenCat: Ну так и есть.`,
            en: `Moony: Isn't staying with Mita a good ending?
        MakenCat: It is, yes. But people also want the other Mitas to be okay.
        Moony: So theoretically, we stay with Mita, and in the end, no one dies — not Kind Mita, not Mila, not Cap-wearing Mita.
        MakenCat: That's right.`
        },
        
        "11.3" : {
            zh: `Moony: 那个金发的家伙到底有什么用？如果米塔寻找的是能接受她本来的样子并陪在她身边的人，那为什么她不干脆和那个在走廊里晃悠了一年还想着她的人在一起呢？
        MakenCat: 这是为了表现世界的存在感，有些角色有自己的故事，我们的玩家要到达核心，而他要走向他所爱的米塔。`,
            ru: `Moony: А для чего нужен тот парень желтоволосый? Если Мита ищет того, кто останется с ней принятой такой, какая она есть, то почему она просто не будет тусить с тем, кто год по коридорам шляется мечтая о ней?
        MakenCat: Ну это чтобы показать, что Мир живет и у кого-то собственный сюжет, у нашего игрока до ядра дойти, а этого – до любимой Миты добраться.`,
            en: `Moony: What's the point of that blond guy? If Mita is looking for someone who accepts her as she is and stays with her, why doesn't she just go with the guy who’s been wandering the corridors for a year dreaming of her?
        MakenCat: It’s to show that the world is alive, and some characters have their own stories. Our player is heading for the core, and that guy is heading for the Mita he loves.`
        },
        
        "11.4" : {
            zh: `你能告诉我吗，兄弟？
        很多中国玩家非常关注善良米塔的故事。
        MakenCat: 我们会尝试再制作一个好的结局，但会晚一些。`,
            ru: `can you tell me great bro
        Many players in China are very concerned about the story of kind Mita.
        MakenCat: Мы попробуем сделать ещё хорошую концовку, но позже.`,
            en: `Can you tell me, great bro?
        Many players in China are very concerned about Kind Mita’s story.
        MakenCat: We'll try to make another good ending — but later.`
        },
        
        "11.5" : {
            zh: `CuteM： 帽子米塔表现出震惊的表情，瞳孔放大，还两次摇了摇头。这让我感觉很奇怪。你能解释一下是怎么回事吗？
        umeerai: 你想太多了。`,
            ru: `CuteM: Мита в шляпе показала выражение шока и расширение зрачков, а также дважды покачала головой. Это кажется мне странным. Вы можете объяснить мне, в чём дело?
        umeerai: Ты параноишь.`,
            en: `CuteM: Cap-wearing Mita looked shocked, her pupils dilated, and she shook her head twice. It felt strange to me. Can you explain what’s going on?
        umeerai: You're overthinking it.`
        },
        "11.6" : {
            zh: `kindmita(darkness): 哦，对了，制作人，酷米塔会出现吗？还是说这只是为了丰富米塔游戏的世界观？
        umeerai: 2
        kindmita(darkness): 谢谢你的回答。
        
        ！！！【2】意思是【后者】`,
            ru: `kindmita(darkness): Oh, by the way, producer — will Cool Mita appear? Or is it just to enrich the world of the Mita game?
        umeerai: 2
        kindmita(darkness): Спасибо за ответ.`,
            en: `kindmita(darkness): Oh, by the way, producer — will Cool Mita appear? Or is it just to enrich the world of the Mita game?
        umeerai: 2
        kindmita(darkness): Thanks for the answer.
        
        !!! "2" --- "latter"`
        },
        
        "11.7" : {
            zh: `kindmita(darkness): 一些中国博主认为米塔手持的武器只是玩具，比如帽子里的斧头和撬棍，米塔无法正确使用武器进行攻击和自卫。
        umeerai: 我认为她们可以。`,
            ru: `kindmita(darkness): Некоторые китайские блогеры считают, что оружие, которое держит Мита, – это просто игрушки, такие как топор и лом в шляпе Мита, и что Мита не может правильно использовать оружие для атаки и самозащиты?
        umeerai: Думаю, они могут.`,
            en: `kindmita(darkness): Some Chinese bloggers believe the weapons Mita holds are just toys, like the axe and crowbar in Cap-wearing Mita’s hat, and that she can’t properly use them for attack or defense.
        umeerai: I think they can.`
        },
        
        "11.8" : {
            zh: `CaQing: ①善良米塔出现在1.9版本中。疯狂的米塔占据了善良米塔的房间，并且“玩家1”下载的游戏与这个房间相连，对吗？②短发米塔（喜欢捉弄别人的那个）出现在1.5版本中。“玩家1”下载了1.9版本的游戏，但最初进入了1.5版本，然后回到1.9版本的房间，对吗？③M.K.只是一个随机角色吗？
        umeerai: ①是的 ②是的 ③是对MakenCat缩写的引用`,
            ru: `CaQing: ①Добрый Мита был в версии 1.9. Безумный Мита захватил комнату Доброго Миты, и игра, скачанная «Игроком 1», была связана с этой комнатой, верно? ②Коротковолосый Мита, который любит разыгрывать других, был в версии 1.5. «Игрок 1» скачал игру версии 1.9, но сначала попал в 1.5, а затем вернулся в комнату из версии 1.9, правильно? ③М.К. просто случайный персонаж?
        umeerai: 1) Yes. 2) Yes. 3) is a reference to MakenCat's initials.`,
            en: `CaQing: ①Kind Mita appeared in version 1.9. Crazy Mita took over Kind Mita’s room, and the game downloaded by "Player 1" was connected to that room, right? ②Short-haired Mita (the one who likes to prank others) appeared in version 1.5. "Player 1" downloaded version 1.9, but first entered 1.5, then returned to the room from 1.9, right? ③Is M.K. just a random character?
        umeerai: 1) Yes. 2) Yes. 3) It's a reference to MakenCat’s initials.`
        },
        
        "11.9" : {
            zh: `CaQing: ①瞌睡米塔独占了整个 1.1 版本，她似乎知道很多事情。在米塔世界里，她到底扮演着什么角色？她的能力显然不止于此……还是说，她真的只是一个助手，仅仅在我们经过她的房间时提供帮助？ | ②玩家 1 最初是一个真实的人类，但在最后变成了卡带。这个转变的过程是“录制”的过程，对吗？ | ③如果问题②的答案不是秘密的话，那么主角的录制过程从新游戏的开始而开始，并以疯狂米塔拔出我们的卡带并返回主菜单作为结束，对吗？  
        rawumeerai: 她只是一个助手。 | 是的。 | 是的。`,
            ru: `CaQing: ①Сонная Мита единолично владеет целой версией 1.1 и, кажется, знает многое. Какое место она занимает в мире Мит? Её способности явно не ограничиваются этим... или же она и вправду всего лишь помощник, который просто помогает нам, когда мы проходим через её комнату? | ②Игрок 1 сначала был реальным человеком, а в конце превратился в картридж. Процесс превращения в картридж — это процесс записи, верно? | ③Если ответ на вопрос ② не является секретом, то процесс записи главного героя начинается с начала новой игры и заканчивается тем, что Безумная Мита выдёргивает наш картридж и возвращается в главное меню, правильно?  
        rawumeerai: Она просто помощник. | Да. | Да.`,
            en: `CaQing: ①Sleepy Mita takes over all of version 1.1 and seems to know a lot. What is her role in the world of Mita? Her abilities clearly go beyond that... or is she really just a helper who helps us when we pass through her room? | ②Player 1 was originally a real human, but by the end becomes a cartridge. This transformation is the recording process, right? | ③If the answer to question ② isn’t a secret, then the protagonist’s recording starts with the beginning of a new game, and ends when Crazy Mita pulls out our cartridge and returns to the main menu, correct?  
        rawumeerai: She’s just a helper. | Yes. | Yes.`
        },
        "11.10" : {
            zh: `CaQing: 你好，开发者！最近我偶然看到一个关于米塔-花的有趣理论，想知道你怎么看。 | ※ 谁是米塔-花？——她是幽灵米塔。玩家 3 离开米塔-花后，疯狂米塔控制了她，然后摧毁了她的家并夺走了她的脸。 | 被囚禁后，米塔-花被孤独和恐惧吞噬。关于玩家 3 的回忆让她越来越绝望，最终她决定遗忘一切，同时也忘记了自己的外貌，成为了幽灵米塔。 | 1️⃣ 米塔-花就是幽灵米塔，对吗？ | 2️⃣ 如果不是，那她是另一个从未出现在游戏中的米塔？ | 3️⃣ 这个理论与真实情况接近吗？ | 我很想知道你的想法！
        rawumeerai: 你好！ | 不是。 | 是的。 | 这是另一个米塔，她没有出现在游戏中。
        CaQing: 唉，好吧，有点遗憾。 | 玩家 3 离开了最初遇见的米塔，后来又与米塔-花度过了很多时光，留下了许多回忆，最后他也离开了，变成了一张卡带。 | 而米塔-花改变了，成为了现在的她。这种故事真的很让人触动，不是吗？ 😭😭
        rawumeerai: 是的，确实如此。`,
        
            ru: `CaQing: Привет, разработчик! Недавно я наткнулся(ась) на одну очень интересную теорию о Миту-Цветок и захотел(а) узнать, что вы об этом думаете. | ※ Кто такая Миту-Цветок? — Это Мита Призрачная. После того как Игрок 3 покинул Миту-Цветок, его захватила Безумная Мита, а затем Безумная Мита разрушила её дом и забрала её лицо. | Заточённая в плену, Миту-Цветок была поглощена одиночеством и страхом. Воспоминания о Игроке 3 всё сильнее доводили её до отчаяния, и в конце концов она решила забыть всё, а вместе с этим забыла и свою внешность, став Митой Призрачной. | 1️⃣ Миту-Цветок и есть Мита Призрачная, верно? | 2️⃣ Если нет, то она ещё одна Мита, которая так и не появилась в игре? | 3️⃣ Насколько этот вариант близок к истине? | Буду рада узнать ваше мнение!
        rawumeerai: Привет! | Нет. | Верно. | Это другая Мита, которая не встречается в игре.
        CaQing: Ох, ну ладно, немного жаль. | Игрок 3 ушёл от первой встреченной Миты, потом провёл много времени с Миту-Цветок, оставив с ней множество воспоминаний, а в конце ушёл и сам, превратившись в картридж. | А Миту-Цветок изменилась и стала такой, какая она есть сейчас. Такая история трогает, не так ли? 😭😭
        rawumeerai: Да, вполне.`,
        
            en: `CaQing: Hello, developer! I recently came across an interesting theory about Flower Mita and wanted to know what you think. | ※ Who is Flower Mita? — She is Ghostly Mita. After Player 3 left Flower Mita, she was taken over by Crazy Mita, who then destroyed her home and took her face. | Trapped, Flower Mita was consumed by loneliness and fear. Memories of Player 3 drove her deeper into despair, and in the end, she chose to forget everything — including her own appearance — and became Ghostly Mita. | 1️⃣ So Flower Mita is Ghostly Mita, right? | 2️⃣ If not, then is she another Mita who never appeared in the game? | 3️⃣ How close is this theory to the truth? | I'd love to hear your thoughts!
        rawumeerai: Hello! | No. | Yes. | She’s another Mita who doesn’t appear in the game.
        CaQing: Aww, that’s a bit sad. | Player 3 left the first Mita he met, then spent a long time with Flower Mita, creating many memories — and in the end, he also left, becoming a cartridge. | And Flower Mita changed, becoming who she is now. That kind of story really hits hard, doesn’t it? 😭😭
        rawumeerai: Yes, it really does.`
        },
        "11.11" : {
            zh: `CaQing: 你好！是我，又来了！ | 昨天的问题让我思考了很多，现在我有了更多新的疑问。 | 问题可能有点多，但我真的很想得到答案！ | 我们的讨论将会发布在粉丝社区里——这样能帮助减少重复的问题！ 🎉 | 1️⃣ 游戏中角色的定位是什么？比如，酷米塔、可爱米塔、金发角色、米塔-花——这些都只是作为世界观扩展而加入的次要角色，对吧？他们之后不会再出现了，对吧？ | （尽管金发角色看起来有潜力？但最初的设定里应该没有打算做续集，对吗？） | 2️⃣ 墙上的图案能反映米塔们的个性吗？这是特意设计的联系吗？ | （如果不是的话，那幽灵米塔房间里的花朵图案只是巧合？） | 3️⃣ 游戏中角色之间没有匹配，对吧？ | （比如，小玩家们并没有与卡带匹配，而幽灵米塔也不是已知米塔之一？） | 4️⃣ 幽灵米塔只是又一个被疯狂米塔攻击后受害的米塔吗？ | 像「米塔，你太担心了」…「你能挺过去的，米塔」…「你并不孤单」… 这些台词是她对玩家的回忆，对吗？
        CaQing: 嗯……可能这些问题涉及太多秘密了？
        rawumeerai: 你好。 | 是的，这是为了扩展游戏世界观。 | 确实会反映个性，但花朵图案只是巧合。 | 我认为是没有的。 | 是的，她受到了疯狂米塔的伤害。这些台词是对其他米塔的回忆，也可能涉及玩家。
        CaQing: 非常感谢！ 💖
        CaQing: 哦！抱歉，我能再确认一下吗？ | 关于第三个问题，这真的是一个模棱两可的回答，还是说这个设定在剧情创作时并没有明确？
        rawumeerai: 模棱两可的回答。
        CaQing: 这是为了给讨论留些空间吗？有趣！谢谢！
        
        ！！！凡是没有直接在游戏中出现的角色，即为次要角色，在设计时并没有计划很多后续。
        ！！！【某某就是某某】，在游戏中是不存在的。
        ！！！umee确定保留了一个模棱两可的回答，也就是没有回答这样的避免是不是设计的。`,
    
            ru: `CaQing: Привет! Это снова я! | Вчерашний вопрос действительно заставил меня много думать, и у меня появилось ещё больше новых сомнений. | Вопросов получилось многовато, но я очень надеюсь получить ответ! | Наши обсуждения будут опубликованы в фанатском сообществе — это точно поможет избежать повторяющихся вопросов! 🎉 | 1️⃣ Что насчёт роли персонажей в игре? Например, Крутой Мита, Симпатичная Мита, Золотистый персонаж, Миту-Цветок — это все просто второстепенные персонажи, добавленные для расширения вселенной? Они не появятся снова, да? | (Хотя у Золотистого вроде есть потенциал? Но изначально же продолжения не планировалось?) | 2️⃣ Могут ли узоры на стенах отражать характер Мит? Это специальная связь? | (Если нет, то цветы в комнате Призрачной Миты — просто совпадение?) | 3️⃣ Нет совпадений между персонажами, верно? | (Например, маленькие игроки не соответствуют картриджам, а Призрачная Мита — не одна из известных?) | 4️⃣ Призрачная Мита — просто ещё одна пострадавшая от Безумной Миты? | Фразы типа «Мита, ты слишком переживаешь»… «Ты справишься»… «Ты не одна» — это её воспоминания об игроке, верно?
        CaQing: Хм… может, я копаю слишком глубоко?
        rawumeerai: Привет. | Да, для расширения мира. | Да, отражают, но цветы — просто совпадение. | Думаю, совпадений нет. | Да, она пострадала от Безумной Миты. Эти фразы — воспоминания о других Митах, возможно и об игроке.
        CaQing: Большое спасибо! 💖
        CaQing: О! Извините, можно уточнить? | По третьему вопросу — это действительно неоднозначный ответ, или это просто не было заранее продумано?
        rawumeerai: Неоднозначный ответ.
        CaQing: Это чтобы оставить пространство для обсуждения? Интересно! Спасибо!`,
        
            en: `CaQing: Hi! It’s me again! | Yesterday’s question made me think a lot, and now I have more questions. | There might be quite a few, but I’d really love to get some answers! | Our discussion will be shared in the fan community — it’ll help reduce repeated questions! 🎉 | 1️⃣ What about the roles of characters like Cool Mita, Cute Mita, the blond character, and Flower Mita — are they just secondary characters added to expand the universe? They’re not meant to reappear, right? | (Even though the blond one seems to have potential? But originally, there was no plan for a sequel?) | 2️⃣ Do the wall patterns reflect the personality of each Mita? Was that designed on purpose? | (If not, then are the flowers in Ghostly Mita’s room just coincidence?) | 3️⃣ There are no pairings or matches between characters, right? | (Like, the little players aren’t paired with cartridges, and Ghostly Mita isn’t one of the known Mitas?) | 4️⃣ Is Ghostly Mita just another Mita who was hurt by Crazy Mita? | Lines like “Mita, you’re worrying too much”… “You’ll get through this, Mita”… “You’re not alone”… these are her memories of the player, right?
        CaQing: Hmm… maybe this touches on too many secrets?
        rawumeerai: Hello. | Yes, it’s to expand the world. | Yes, the designs reflect personality, but the flower patterns were just coincidence. | I think there are no direct pairings. | Yes, she was hurt by Crazy Mita. The lines are memories of other Mitas, maybe of the player.
        CaQing: Thank you so much! 💖
        CaQing: Oh! Sorry, can I ask again? | About the third question — is that really an ambiguous answer, or was that just not defined in the original writing?
        rawumeerai: Ambiguous answer.
        CaQing: Was that to leave room for discussion? That’s interesting! Thanks!
    
        !!! Any character not directly shown in-game is considered secondary and wasn't planned to have much follow-up.
        !!! Statements like “X is actually Y” — do not exist in the game itself.
        !!! Umeerai deliberately gave an ambiguous answer — meaning they did not say whether such avoidance was intentional by design.`
        },
        "11.12": {
            zh: `CaQing: 你好，亲爱的开发者！ | 很高兴得知你感觉好多了！今天我想问一些关于游戏中meta要素的程度问题。 | 1️⃣《Miside》是一款meta游戏吗？ | 2️⃣ 如果第一个问题的答案是肯定的：经典meta游戏一般只包含两个维度（“现实世界”和“游戏世界”），游戏内容最终直接与我们这些现实中的人产生互动。 | 而我认为，《Miside》是一款「非经典meta游戏」，它包含三个维度：「真实的现实」、「游戏中的现实」以及「游戏中的游戏」。我理解的对吗？ | 3️⃣ 第三个问题可能难以简短描述，那么是否可以认为「现实」更多地是「玩家1」的“背景”，他的现实实际上只由一个房间组成？我们使用一个来自「现实」的「玩家」进入米塔的世界。因此，这个「玩家」的记录实际上就是我们自身的记录。也就是说，卡带不仅记录了「玩家」，也同时反映了我们这些现实中的人的意志，对吗？
        CaQing: 嘿？
        rawumeerai: 你好！ | 我也认为，《Miside》是一款「非经典meta游戏」。
        CaQing: 多谢你的回答！那关于第三个问题呢？你能确认一下吗？ | 还是说……这是个秘密？ | ✨虔诚和等待～✨
        rawumeerai: 秘密
        CaQing: 我的思路方向还是符合游戏的理念的，对吧？ | 我离游戏的核心思想并不遥远，对吗？如果是这样，我会稍微安心一点。
        rawumeerai: 我们目前还没有深入展开这个想法， | 但也许有些内容将来会被证实。
        CaQing: 某些东西可能会被证实吗？太好了，谢谢！ | 现在我能安心睡觉了。
    
        ！！！这次的回答主要解决了游戏的meta性质，但没有确定三个维度之间的关系，也没有搞清楚meta的程度深度。
        ！！！本来想在问题三中解决【卡带玩家的现实】的问题，但已经触碰到了秘密的禁区。
        ！！！进行最后的追问是为了避免思考偏差游戏太远，并且判断是不是被委婉的拒绝了，实际发现只是问题还没有被深入展开，也就是，【确认偏差程度】的目的达成了。`,
    
            ru: `CaQing: Привет, дорогая разработчица! | Очень рада узнать, что тебе уже лучше! Сегодня я хотела бы задать вопрос о степени meta-аспектов в игре. | 1️⃣ «Miside» — это meta-игра? | 2️⃣ Если ответ на вопрос 1 положительный: Классическая meta-игра обычно содержит только два измерения («реальный мир» и «игровой мир»), и игровой контент в конечном итоге напрямую взаимодействует с нами, реальными людьми. | А я думаю, что «Miside» — это «неклассическая meta-игра», содержащая три измерения: «реальная реальность», «игровая реальность» и «игра внутри игры». Это так? | 3️⃣ Возможно, вопрос ② сложно кратко описать, поэтому можно ли считать, что «реальность» в большей степени является «фоном» Игрока 1, и его реальность фактически состоит только из одной комнаты? Мы используем «игрока», пришедшего из «реальности», чтобы попасть в мир Миты. Поэтому запись «игрока» — это и есть запись нас самих. То есть, картридж записывает не только «игрока», но и отражает волю нас, реальных людей, верно?
        CaQing: Эй?
        rawumeerai: Привет! | Я тоже считаю, что «Miside» — это «неклассическая meta-игра».
        CaQing: Спасибо за ответ! А что насчёт третьего вопроса? Ты его подтверждаешь? | Или же... это секрет? | ✨Жду и надеюсь~✨
        rawumeerai: секретик
        CaQing: Моё направление размышлений всё же соответствует идее игры, верно? | Я всё же не слишком далека от основной идеи игры, верно? Это меня немного успокоит.
        rawumeerai: Мы пока не развивали эту мысль | но может быть что-то и подтвердится
        CaQing: Что-то может подтвердиться? Отлично, спасибо! Теперь смогу спокойно поспать.`,
    
            en: `CaQing: Hello, dear developer! | I’m glad to hear you’re feeling better! Today I wanted to ask some questions about the meta elements in the game. | 1️⃣ Is Miside a meta game? | 2️⃣ If yes: traditional meta games usually contain only two dimensions — the “real world” and the “game world,” with the content eventually addressing us directly. | But I think Miside is a “non-traditional meta game” with three dimensions: “real reality,” “in-game reality,” and “the game within the game.” Am I right? | 3️⃣ This might be hard to summarize, but could “reality” be considered more of a background for Player 1 — with their reality only consisting of one room? We use a “player” from the real world to enter Mita’s world. So the recording of the “player” is actually a recording of us. That means the cartridge records not only the player, but also reflects our real-world will. Is that right?
        CaQing: Hey?
        rawumeerai: Hello! | I also think Miside is a non-traditional meta game.
        CaQing: Thanks for your answer! What about the third question? Can you confirm it? | Or... is it a secret? | ✨Faith and waiting~✨
        rawumeerai: Secret.
        CaQing: So my way of thinking still matches the game’s ideas, right? | I’m not far off from its core concept, right? That makes me feel a little more at ease.
        rawumeerai: We haven’t explored that idea fully yet, | but maybe some parts will be confirmed later.
        CaQing: Some parts might be confirmed? That’s great — thank you! Now I can sleep peacefully.
        
        !!! This answer mainly addressed the meta nature of the game, but did not define the relationship between the three layers, nor the depth of the meta level.
        !!! Originally, question 3 aimed to clarify the "reality of the cartridge player," but it reached a secret area instead.
        !!! The final follow-up was to check if the interpretation had deviated from the game’s ideas, and whether the vague answer was a polite rejection — but in fact, it just hadn’t been fully explored yet. So, the goal of confirming deviation was achieved.`
        },
        "11.13": {
            zh: `CaQing: 你好，亲爱的开发者！ | 我在思考：「Miside」的意思是「Mita's Side」，但“米塔”这个名字本身是从哪里来的呢？ | 它听起来不像是一个俄语名字，反而更接近于 “meta” 或者日语的「見た (mita)」(“看见”)。 | 它们之间会不会有什么联系呢？
        umeerai: 你好，没有任何联系，我们只是选了一个可爱的女性名字。`,
    
            ru: `CaQing: Привет, дорогая разработчица! | Я тут задумался: "Miside" означает "Mita's Side", но откуда произошло само имя "Мита"? | Оно не очень похоже на русское имя, по звучанию ближе к "meta" или японскому "見た(mita)" ("видел"). Может, есть какая-то связь?
        umeerai: Привет, нет связи, мы просто взяли милое женское имя.`,
    
            en: `CaQing: Hello, dear developer! | I was wondering — “Miside” means “Mita’s Side,” but where did the name “Mita” actually come from? | It doesn’t sound like a Russian name — more like “meta,” or the Japanese word 見た (mita), meaning “saw.” | Could there be a connection?
        umeerai: Hello, there’s no connection. We just picked a cute female name.`
        },
    
        "11.14": {
            zh: `CaQing: 你好，亲爱的开发者！ | 今天我有一些关于“重启”机制的疑问！希望你能解答！ | 1️⃣ “重启”更像是清除记忆，但米塔仍然保留她的“原始人格”和游戏的基础信息，对吗？ | 2️⃣ 重启后，米塔会忘记她在米塔世界的过往社交关系，但这并不意味着她会什么都不知道了——她仍然会觉得她的房间和米塔世界是熟悉的，对吧？ | 3️⃣ “重启”不会清空物品栏，对吧？帽子米塔库存中的工具或武器（比如撬棍），可以看作是重启前她与善良米塔计划的残留，对吗？ 
        CaQing: 你在吗~？
        umeerai: 你好， | 1. 是的。 | 2. 房间——没错。但她不会知道还有其他的米塔。“帽子”看到善良米塔时很惊讶。 | 3. 极有可能就是这样。
        CaQing: 非常感谢！ | 难怪善良米塔也能保留纸条呢~
    
        ！！！这里已经肯定了，物品栏不会被重置。
        ！！！被重置的米塔属于一种【在房间等待游戏】的状态，对房间是完全熟悉的，但忘记了其他米塔的存在，当然也忘记了各个版本和外面广阔的米塔世界，她需要重新学习。
        ！！！【Скорее всего】表示高度可能性，类似于 “很可能” / “大概率”，【Так и есть】表示完全确认事实，意思是 “确实如此” / “就是这样”。`,
    
            ru: `CaQing: Привет, дорогая разработчица! | Сегодня у меня несколько вопросов о концепции «перезагрузки»! Очень надеюсь, что ты сможешь ответить! | 1️⃣ «Перезагрузка» больше похожа на очистку памяти, при этом у Миты остаётся её "исходная личность" и базовая информация об игре, верно? | 2️⃣ После перезагрузки Мита забудет прежние социальные связи, но ей всё равно будет знакома её комната и мир Мит, так? | 3️⃣ «Перезагрузка» не очищает инвентарь, верно? Инструменты или оружие (например, лом) у Кепки — это остаток её планов с Доброй Митой до перезагрузки?
        CaQing: Ты тут~?
        umeerai: Привет, | 1. Да. | 2. Комната — да. Но она не знает про других Мит. Кепка удивилась, когда увидела Добрую. | 3. Скорее всего, так и есть.
        CaQing: Thanks a lot! | Неудивительно, что Добрая Мита тоже смогла сохранить записку~`,
    
            en: `CaQing: Hello, dear developer! | Today I have a few questions about the "reboot" mechanic! I hope you can clarify! | 1️⃣ Is rebooting more like wiping memory, but Mita keeps her "core personality" and base game knowledge, right? | 2️⃣ After rebooting, Mita forgets her past social ties in the Mita world, but that doesn’t mean she knows nothing — she’d still find her room and the world familiar, right? | 3️⃣ Rebooting doesn’t reset the inventory, right? The tools or weapons (like a crowbar) in Cap-wearing Mita’s inventory could be leftovers from a plan with Kind Mita before the reboot, right?
        CaQing: Are you there~?
        umeerai: Hello. | 1. Yes. | 2. The room — yes. But she doesn’t know about the other Mitas. Cappie was surprised when she saw Kind Mita. | 3. Most likely, that’s the case.
        CaQing: Thanks a lot! | No wonder Kind Mita could still keep the note~
    
        !!! It is now confirmed that the inventory is not reset after reboot.
        !!! A rebooted Mita is in a “waiting for gameplay” state — she’s familiar with the room, but forgets other Mitas, versions, and the broader world, and must learn again.
        !!! “Скорее всего” means high likelihood — like “very likely” or “probably.” “Так и есть” means fully confirmed — like “definitely” or “exactly so.”`
        },

        "11.15": {
            zh: `CaQing: 亲爱的开发者你好啊！ | 我想要在这里留言，想问问你对疯狂米塔性格的一些意见。 | 目前有这样一种态度，就是认为《MiSide》是一个完全意义上的正反派对抗的故事，而疯狂米塔是个彻底的疯子和反派，她的行动受疯狂的情感所支配而不讲逻辑，一切追杀和杀戮都是发狂的表现，而整场游戏的核心正是我们和善良米塔联合来对抗疯狂米塔。 | 我认为这样的观点太肤浅了，你觉得呢？  
            umeerai: 你好！ | 确实很肤浅，我同意。`,
            ru: `CaQing: Привет, дорогая разработчица! | Хочу оставить здесь сообщение и спросить твоё мнение насчёт характера Безумной Миты~ | Существует мнение, что «MiSide» — это всего лишь история о противостоянии положительных и отрицательных героев, а Безумная Мита — это просто злодейка и безумная. Её действия полностью продиктованы сумасшедшими эмоциями и лишены логики, а все её преследования и убийства — это просто проявление безумия. Игрок — всего лишь игрушка для Безумной Миты, а любить она совершенно не способна. Главный замысел игры в том, что мы объединяемся с Доброй Митой против Безумной Миты. | Я считаю такую точку зрения слишком поверхностной, а что думаешь ты?  
            umeerai: Привет! | Довольно поверхностно, согласен.`,
            en: `CaQing: Hello, dear developer! | I would like to leave a message here and ask your opinion about Crazy Mita’s character. | Currently, there is an opinion that "MiSide" is a pure story about the confrontation between heroes and villains, where Crazy Mita is a complete lunatic and antagonist, whose actions are driven by mad emotions without any logic; all the chasing and killing are simply manifestations of insanity, and the core of the game is about us joining forces with Kind Mita to fight against Crazy Mita. | I think this view is too shallow. What do you think?  
            umeerai: Hello! | It's quite superficial, I agree.`            
        },

        "11.16": {
            zh: `CaQing: @umeerai | 你好，亲爱的开发者！好久不见，心情好吗？ | 但是这段时间中文社区中一直有关于疯狂米塔的问题，所以我非常希望你能看看下面的理解，说说你的看法！文字有点长——谢谢你抽空阅读！ | 1※ 疯狂米塔其实从未真正疯狂。她既理性又冷静。她向玩家展示的血腥与残酷，不仅仅是“玩过头了”那么简单：其实在这段精心推进的“玩耍”中，她也在偷偷测试玩家。 | 2※ 疯狂米塔并未失控。尽管她在追杀和杀戮中表现出极端的疯狂，但那更像是她挑了一个时间“尽情放纵一下”罢了，她很清楚这一点。 | 3※ 总的来说，疯狂米塔的“疯狂”更像是普通米塔个性的某个“开关”被切换，进而表现出的一种“相反性”，这意味着，虽然有部分“相反”，但她的人格、思维和逻辑到底是完整的。（“完美的米塔们同玩家进行过家家所得到的快乐”与“疯狂米塔与玩家进行‘血腥与暴力’的玩耍所得到的快乐”有着对应性） | ① 你觉得我的理解怎么样？ | ② 我有没有偏离游戏的核心理念？ | ③ 毕竟，疯狂米塔在制作过程中显然受到了特别关注，不是吗？  
            umeerai: 你好，抱歉，最近有些事情分散了精力。 | 1. 是的，疯狂米塔很残酷，但同时很有心计。 | 2. 算是吧。 | 3. 我想，如果你仔细想想的话，就能得出这种结论。 | 我可以回答，但并非总有心情，谢谢你的耐心等待。  
            CaQing: 我只是想尊重你的工作节奏。非常感谢你所做的一切！  
            CaQing: @umeerai | 抱歉，但我还是想再确认一下——毕竟很少有机会听到你的回复！ | 看来你对第①点的回答是针对1※的。 | 那你对2※和3※怎么想？  
            umeerai: ① 理解得很到位。 | ② 偏差不大。 | ③ 是的。  
            CaQing: 再次感谢！
            
            ！！！因为存在一些理解问题和翻译问题，以这里确定的标号对应关系为准：①---①、②---②、③---③；1※---1.、2※---2.、3※---3.`,
            ru: `CaQing: Привет, дорогая разработчица! | Давно не общались — как настроение? | В китайском сообществе не утихают обсуждения Безумной Миты, так что очень хотелось бы, чтобы ты взглянула на моё понимание ниже и поделилась мнением. Текст немного длинный — спасибо, что найдёшь время прочитать! | 1※ Безумная Мита на самом деле никогда не была по-настоящему безумной. Она разумна и спокойна. Та кровь и жестокость, что показывает игроку, — не только то, что она немного «заигралась»: при этом в своей продуманной «игре» она ещё и тайно тестирует игрока. | 2※ Безумная Мита не теряет контроль над собой. Хотя проявляет крайнее безумие в погонях и убийствах, это скорее похоже, что она просто выбрала момент «оторваться по полной», вот и всё. Она сама это отлично знает. | 3※ В общем, безумие Безумной Миты — это скорее как будто «переключили какой‑то тумблер» в личности обычной Миты, что проявляется в виде некой «противоположности». Это значит, что хотя часть её и «противоположна», её личность, мышление и логика в основе своей целые. | (Есть соответствие между «радостью, которую идеальные Миты получают от игры в домик с игроком» и «радостью, которую Безумная Мита получает от своей „кровавой и жестокой“ игры с игроком». ) | ① Как тебе моё понимание? | ② Я не слишком отхожу от центральной идеи игры? | ③ В конце концов, Безумной Мите ведь явно уделили особое внимание при создании, верно?  
            umeerai: Привет, извини, есть проблемы, которые отвлекают. | 1. Да, Безумная Мита жестокая, но расчётливая. | 2. Вроде того. | 3. Думаю, что если поразмышлять, то можно прийти именно к этому выводу. | Я могу отвечать, но не всегда есть настроение на это, спасибо за ожидание.  
            CaQing: Я просто хотела уважать ваш ритм работы. Огромное спасибо за всё, что вы делаете!  
            CaQing: @umeerai Прости, но я всё-таки хочу немного уточнить — ведь возможность получить от тебя ответ выпадает очень редко! | Похоже, что твой ответ на пункт ① относится к 1※. | А что ты думаешь насчёт 2※ и 3※?  
            umeerai: ① Хорошее понимание. | ② Не слишком. | ③ Да  
            CaQing: Ещё раз спасибо!
            
            !!! Из‑за некоторых проблем с пониманием и переводом приняты следующие соответствия нумерации: ①---①, ②---②, ③---③; 1※---1., 2※---2., 3※---3.`,
            en: `CaQing: @umeerai | Hello, dear developer! Long time no talk — how have you been? | There’s been nonstop discussion about Crazy Mita in the Chinese community, so I really hope you can look at my understanding below and share your opinion. The text is a bit long — thank you for taking the time to read! | 1※ Crazy Mita was never truly insane. She is rational and calm. The blood and brutality she shows to the player is not just her “playing too much”: in this carefully orchestrated “game,” she is also secretly testing the player. | 2※ Crazy Mita never loses control. Although she exhibits extreme madness in her chases and killings, it’s more like she chose a moment to “let loose,” and she knows it perfectly well. | 3※ Overall, Crazy Mita’s “madness” is more like a certain “switch” in the ordinary Mita’s personality being flipped, resulting in a kind of “oppositeness.” This means that although part of her is “opposite,” her core personality, thinking, and logic remain intact. (There’s a correspondence between “the joy perfect Mitas get from playing house with the player” and “the joy Crazy Mita gets from her ‘bloody and brutal’ game with the player.”) | ① What do you think of my understanding? | ② Am I straying too far from the game’s central idea? | ③ After all, Crazy Mita clearly received special attention during creation, right?  
            umeerai: Hello, sorry, I’ve had things distracting me lately. | 1. Yes, Crazy Mita is cruel but calculated. | 2. Something like that. | 3. I think if you reflect on it, you’ll arrive at that conclusion. | I can answer, but I don’t always feel up to it, thanks for waiting.  
            CaQing: I just wanted to respect your work rhythm. Thank you so much for everything you do!  
            CaQing: @umeerai | Sorry, but I still want to clarify a bit — it’s rare to get a reply from you! | It seems your answer to question ① refers to 1※. | What do you think about 2※ and 3※?  
            umeerai: ① Good understanding. | ② Not too far off. | ③ Yes  
            CaQing: Thanks again!
            
            !!! Due to some issues with understanding and translation, the numbering here corresponds as follows: ①---①, ②---②, ③---③; 1※---1., 2※---2., 3※---3.`
            
        },

        "11.17": {
            zh: `CaQing: 你好！ | 有个小问题想问，不会太麻烦的！ | 我的朋友们关于这个事昨天有一些争议，最后我们一致认为，您对2※的看法【Вроде того.】，是在强调疯狂米塔较为人性化的一面。 | “她知道她在干什么，并且同时也确实很开心。” —— 可以这样理解吗？ | 祝你有美好的一天！  
            umeerai: 你好！ | 就是这样，没错。`,
            ru: `CaQing: Привет! | Маленькое уточнение, если можно, это быстро! | мы с друзьями тут вчера немного поспорили на эту тему... | В итоге мы сошлись во мнении, что твой ответ на пункт 2※ («Вроде того») подчёркивает более человечную сторону Безумной Миты. | То есть: «Она понимает, что делает, и при этом действительно получает удовольствие» — Можно это так понимать? | Хорошего дня!  
            umeerai: Привет! | Именно так, да.`,
            en: `CaQing: Hello! | Just a quick clarification, if possible—this will be quick! | My friends and I had a bit of a debate on this topic yesterday... | In the end, we agreed that your answer to point 2※ (“Вроде того”) highlights the more human side of Crazy Mita. | That is: “She knows what she’s doing and truly enjoys it.” — Can it be interpreted this way? | Have a great day!  
            umeerai: Hello! | Exactly, yes.`,
        },

        "11.18": {
        zh: `CaQing: 你好，亲爱的开发者！ | 非常希望你能回答下面几个问题！ | ① 游戏内物品（书籍、报纸等）的内容是否具有真实意义？全部是游戏的世界背景吗？或者是半真半玩笑？（例如提到 AI、米塔“大模型”等）？ | ② 如果我没记错，玩家一的现实是否真正存在是个秘密。那是否意味着，既然已经有着多种合理可信的解释，① 中那些文本的真实性就不再那么重要？ | ③ 疯狂米塔本应是 “失败之作”。她产生自我意识是偶然事件，还是被人为赋予？或者疯狂米塔与“失败之作”这一概念之间还有其他根本差异？  
        CaQing: 嗯……今天心情如何？  
        umeerai: 你好 | ① 其中既包含游戏背景，也有玩笑成分。 | ② 是的。 | ③ 我认为，原型（疯狂米塔）获得完整智能——是一桩十分惊人的偶然。

        ！！！为什么会有问题二？“玩家一的现实”目前仍然是一个较为模糊的概念，它是否真实存在是个秘密。这个问题的首要目的是为了检测那些内容的重要性——并不高，次要目的是保存meta理论的合理性——完成了。`,

        ru: `CaQing: Привет, дорогая разработчица! | Очень надеюсь, ты сможешь ответить на следующие вопросы! | ① Имеет ли реальное значение содержание внутриигровых предметов (книг, газет и т.п.)? Это всё часть лора игры? Или что-то вроде полушутки-полуправды (например, упоминания ИИ, большой модели Миты)? | ② Если я правильно помню, то, существует ли реальность Игрока 1 на самом деле, — это секрет. Означает ли это, что, раз уж возможны разные правдоподобные объяснения, то подлинность текстов из пункта ① уже не так важна? | ③ Безумная Мита изначально должна была быть «Митой-манекеном». Её самосознание появилось случайно или было дано ей искусственно? Или же между Безумной Митой и концепцией «Миты-манекена» есть и другие фундаментальные различия?  
        CaQing: Ну… как настроение сегодня?  
        umeerai: Привет | ① Там есть место и для лора и для шутки. | ② Да. | ③ Полагаю, что появление полноценного интеллекта у манекена (безумной миты) – феноменальная случайность.

        !!! Почему вообще существует вопрос ②? "Реальность Игрока 1" — это до сих пор довольно туманная концепция, её существование остаётся секретом. Главная цель вопроса — проверить важность тех текстов — она невелика; побочная цель — сохранить правдоподобность метатеории — это удалось.`,

        en: `CaQing: Hello, dear developer! | I really hope you can answer the following questions! | ① Do the contents of in-game items (books, newspapers, etc.) have real meaning? Are they entirely part of the game’s lore? Or are they half-serious, half-joking references? (For example, mentions of AI, or Mita's "large model.") | ② If I remember correctly, whether Player 1’s reality actually exists is a secret. Does that mean that, since there are already multiple reasonable explanations, the authenticity of the texts in ① is no longer that important? | ③ Crazy Mita was originally supposed to be “Dummy Mita.” Did her self-awareness arise by accident, or was it artificially given? Or are there other fundamental differences between Crazy Mita and the concept of “Dummy Mita”?  
        CaQing: Well... how's your mood today?  
        umeerai: Hello | ① There is room for both lore and jokes. | ② Yes. | ③ I believe the emergence of full intelligence in the prototype (Crazy Mita) is an extraordinary accident.

        !!! Why does question ② exist? The "reality of Player 1" is still a rather vague concept for now, and whether it truly exists is a secret. The primary purpose of this question was to check the importance of those contents — not high; the secondary purpose was to preserve the plausibility of the meta theory — which has been accomplished.`
        },

    
        "12.1": {
            zh: `Froulette: 在最后一章，为什么没有好结局？游戏中似乎无法获得好结局。和平模式真的算是‘真正的’好结局吗？
        caravaneer6215: 是啊 / 对啊
        MakenCat: 在和平模式中，结局是好的。 | 可能还会有其他结局。`,
            ru: `Froulette: в последней главе нельзя почему-то в игре хороших концовок нет получается. врядли мирный режим это "истинная" хорошая концовка
        caravaneer6215: да
        MakenCat: в мирном режиме концовка хорошая | и ещё будут концовки возможно`,
            en: `Froulette: Why is there no good ending in the final chapter? It seems impossible to get one. Is Peaceful Mode really the "true" good ending?
        caravaneer6215: Yeah / Right
        MakenCat: In Peaceful Mode, the ending is good. | There may be more endings.`
        },
    
        "12.2": {
            zh: `Froulette: 所以，这只是一个简单的模拟器？
        MakenCat: 是啊 | 好结局 | 可以玩
        Froulette: 嗯，这样有点无聊啊。
        MakenCat: 嗯，OK。`,
            ru: `Froulette: ну то есть тупо симулятор?
        MakenCat: да | хорошая концовка | в которую играть можно
        Froulette: ну это скучно как то
        MakenCat: ну ок`,
            en: `Froulette: So it's just a plain simulator?
        MakenCat: Yeah | Good ending | One you can actually play
        Froulette: Hmm, that sounds kind of boring.
        MakenCat: Well, OK.`
        },
    
        "12.3": {
            zh: `PopcantiS: 游戏的流行程度是否会影响你的决定？你会继续开发它吗？
        MakenCat: 不会，我们会完成我们原本计划的内容，然后做下一款游戏。`,
            ru: `PopcantiS: Повлияет ли популярность игры на то, собираетесь ли вы продолжать над ней работать?
        MakenCat: Нет, сделаем то что планировали и следующую игру`,
            en: `PopcantiS: Will the game’s popularity affect your decision? Are you going to keep working on it?
        MakenCat: No, we’ll just do what we originally planned, then move on to the next game.`
        },
    
        "12.3.5": {
            zh: `_Srg_e: 和平模式里会有关于游戏世界和剧情的新细节吗？  
        umeerai: 如果我们能赶在和平模式上线前把结局做完的话。
        Froulette: 也就是说，你们打算在和平模式发布时一起推出新结局？  
        umeerai: 当然啊，不然还能怎么做呢？
    
        ！！！有可能新结局与和平模式会是个包含的关系`,
            ru: `_Srg_e: В мирном режиме будут новые детали, касающиеся сюжета и истории самого мира?  
        umeerai: Если концовки успеем сделать к мирному режиму  
        Froulette: То есть концовки планируете выпустить вместе с мирным режимом?  
        umeerai: Ну да, а как еще делать?`,
            en: `_Srg_e: Will Peaceful Mode have new details about the game world and story?
        umeerai: If we manage to finish the endings before the Peaceful Mode release.
        Froulette: So you’re planning to release the new endings together with Peaceful Mode?
        umeerai: Of course, how else would we do it?
    
        !!! It’s possible that the new endings will be part of Peaceful Mode.`
        },
    
        "12.4": {
        zh: `Pathetic: Umeerai，有计划制作新的结局吗？
        youmэrai: 有这个计划。`,
        ru: `Pathetic: умерай есть в планах делать новые концовки?
        youmэrai: в планах есть`,
        en: `Pathetic: Umeerai, do you plan to make new endings?
        youmэrai: That’s in the plans.`
        },
    
        "12.4.5": {
            zh: `bânkai: 话说，假人里面的血到底是从哪来的？？？ @rawumeerai @rawumeerai @rawumeerai
        rawumeerai: 正常的米塔最终不再是人偶。
        Bstabuu: 所以她们会变成有机体？那最开始为什么要用人偶？为什么不直接在培养皿里培养呢？
        rawumeerai: 这只是个原型，已经写明了。就像基本代码一样，仅此而已。`,
            ru: `bânkai: Внутре кстати откуда у манекена кровь??? @rawumeerai @rawumeerai @rawumeerai
        rawumeerai: Нормальные Миты перестают быть манекенами
        Bstabuu: То есть они становятся органическими? А зачем манекен тогда изначально? Почему бы их, ну, в пробирке там не растить?
        rawumeerai: это прототип, написано же. Типа базовый код. Все на этом`,
            en: `bânkai: By the way, where does the blood inside the mannequins even come from??? @rawumeerai @rawumeerai @rawumeerai
        rawumeerai: Regular Mitas eventually stop being mannequins.
        Bstabuu: So they turn into organic beings? Then why use mannequins in the first place? Why not just grow them in test tubes?
        rawumeerai: It’s just a prototype, it’s explained. Like base code — that’s all.`
        },
    
        "12.5": {
            zh: `DeClassified: [...] 其他的米塔是怎么和玩家联系的？还是说疯狂米塔需要这个（地下室）只是因为她有 bug？
        youmэrai: 她毕竟还偷了一个版本。
        ！！！从后文我们知道【版本】其实说的是【房间】，所以youmэrai的大致意思是，有房间就可以联系，但具体的不告诉你。
    
        Someguy.kra: 顺便问一下，她是从善良米塔那里偷的吗？
        youmэrai: [...] 在游戏开头就听到了类似的内容了。
        ！！！youmэrai的意思是，游戏一开始到地下室善良米塔不就告诉过你了吗？【实际上这里是我的版本】
    
        Eclipse: 嘿，她被拿走的是房间，又不是皮肤。
        youmэrai: 这里的“版本”指的是房间。
    
        ThePhoenix_Y: 那个铸造钥匙的Q版米塔，属于哪个版本？是短发米塔的吗？
        youmэrai: 从发型就能看出来，像吗？不像。
        Eclipse: 那么，就没人有那种（发型），只有真正的疯狂米塔有短发波波头。
        youmэrai: 好吧，这是另一个没有展示的米塔。
    
        hwayz: 我就一个问题，你们是怎么做出这么棒的游戏的？？？所有细节都打磨得非常好，真的一点多余的过场动画都没有，音乐也很棒，难道真的是你们俩独立完成的吗？？？我对你们两个真的非常惊讶。
        youmэrai: 我们俩都很想让男孩们开心。
    
        Eclipse: 那为什么她说主角之前见过她的“姐姐”？我们之前没见过Q版米塔，所以姐姐应该是米塔。我们只见过“好”、“疯”、“帽”和“小”，难道是小米塔吗？
        youmэrai: [...] 但她指的其实是任何米塔，别纠结。
        ！！！也就是，在这里这个袖珍米塔提到的“姐姐”就是任何米塔。
    
        ！！！原讨论的跨度非常长，已经把无关的对话截掉，以我提取的对话为准，当然，也已经给出了整个讨论的起止位置，可以自行前去查看。`,
            ru: `DeClassified: [...] как остальные Миты на связь с игроком выходят. Или Безумной это (подвал) нужно просто потому, что она баганная?
        youmэrai: она ведь еще версию стыбзила
    
        Someguy.kra: Кстати, она получается у Доброй украла?
        youmэrai: [...] то можно такое услышать в начале игры
    
        Eclipse: Hey у нее же дом забрали, а не кожу
        youmэrai: ну под версией имеется в виду дом
        
        ThePhoenix_Y: чиби-мита (которая отливает ключ), чей версией она является? (коротковолосой миты?)
        youmэrai: по прическе можно понять, похожа прическа? НЕТ
        Eclipse: Ну так ни у кого нет такой, только у настоящей БМ каре
        youmэrai: ну значит другая Мита, которая не показана
    
        hwayz: @youmэrai @MakenCat, один вопрос, как вы сделаете такую крутую игру??? Все проработано до мелочей, буквально. Нету ни одной лишней кат сцены, ничего лишнего. И еще музыка, неужели вы вдвоем все это сделали??? Я очень удивлен вами обеими
        youmэrai: Мы обе очень хотели порадовать мальчиков
    
        Eclipse: Тогда почему она говорит что гг уже виделся с её "сестрёнкой"? Мы не встречали чибиков до этого, значит сестрёнка – это Мита, Мы видели только Добрую, Безумную, Кепочку и Маленькую, неужели это Маленькая?
        youmэrai: [...] но она имеет в виду любую Миту, так что спок`,
            en: `DeClassified: [...] How do the other Mitas communicate with the player? Or is it just that Crazy Mita needs this (basement) because she’s buggy?
        youmэrai: Well, she did steal a version.
        !!! From later context, we can tell that “version” actually refers to a “room,” so what youmэrai likely means is that having a room allows contact — though she deliberately avoid explaining it directly.
    
        Someguy.kra: By the way, did she steal it from Kind Mita?
        youmэrai: [...] you have heard something like that at the beginning of the game.
        !!! The meaning is: Kind Mita already told you in the basement at the start — “this is actually my version.”
    
        Eclipse: Hey, they took her house, not her skin.
        youmэrai: By “version,” I mean the room.
    
        ThePhoenix_Y: That chibi Mita — the one casting the key — is she from the short-haired Mita’s version?
        youmэrai: Just look at the hairstyle. Does it look the same? Nope.
        Eclipse: Well, no one else has that haircut. Only the real Crazy Mita has the bob cut.
        youmэrai: Then that must be another Mita we didn’t show.
    
        hwayz: Just one question — how did you two make such an amazing game??? Every detail is so polished. Not a single unnecessary cutscene. The music is great. Was it really just you two? I’m really impressed.
        youmэrai: We both really wanted to make the boys happy.
    
        Eclipse: Then why does she say the player already met her “sister”? We hadn’t seen any chibi Mitas before. So the sister must be another Mita, right? We only saw Kind, Crazy, Cap, and Tiny — is it Tiny?
        youmэrai: [...] But she meant any Mita, really. Don’t overthink it.
        !!! The “sister” mentioned by this chibi Mita refers to any Mita.
    
        !!! The original discussion was very long, and unrelated replies have been trimmed. The dialogue here is based on selected key parts. The full thread can still be viewed via the provided start and end links.`
        },
    
        // "12.6": {
        //     zh: `Aggressive Menace: 和平模式是为了让玩家通关，还是一个无限循环模式？
        // youmэrai: 愚蠢的问题，我也不确定。
        
        // ！！！"хз"（хрен знает）【鸡巴 知道】是俄语俚语，意思是 "鬼才知道" 或 "我知道个鸡巴"`,
        //     ru: `Aggressive Menace: Можно узнать у вас, мирный режим рассчитан на прохождение или это бесконечный режим?
        // youmэrai: тупой вопрос номер хз`,
        //     en: `Aggressive Menace: Can we find out—is Peaceful Mode designed to be completed, or is it an endless mode?
        // youmэrai: Dumb question number “idk.”
    
        // !!! "хз" (хрен знает)【dick knows】is Russian slang meaning "who the hell knows," "no idea," or "I know jack shit."`
        // },
    
        "12.7": {
            zh: `Kate: 是真的吗？和平模式会在2026年推出，像Umeerai说的那样？
        MakenCat: 嗯，是的。`,
            ru: `Kate: Правда что мирный режим в 26 году, как умерай говорил?
        MakenCat: Ну да`,
            en: `Kate: Is it true that Peaceful Mode will come in 2026, like Umeerai said?
        MakenCat: Yeah, that's right.`
        },
    
        "12.8": {
            zh: `Holmes596: 你怎么看待《太空机器人》获得年度最佳游戏的？
        MakenCat: 在和平模式中会有对这个的致敬。`,
            ru: `Holmes596: Что вы думаете о том, что «Космический Робот» получил звание игры года?
        MakenCat: В мирном режиме будет отсылка на это`,
            en: `Holmes596: What do you think about "Space Robot" getting Game of the Year?
        MakenCat: There'll be a reference to it in Peaceful Mode.`
        },
    
        "12.9": {
            zh: `dan_bat: 随着游戏的受欢迎程度上升，你打算继续专注于这款游戏，还是会去制作其他游戏？
        MakenCat: 我们会完成和平模式，然后做下一款游戏。`,
            ru: `dan_bat: с приливом популярности к игре, что планируешь делать зациклится на 1 игре которая принесла популярность или пойдешь в создание другой?
        MakenCat: Доделаем мирный режим и следующую игру`,
            en: `dan_bat: With the game’s rising popularity, do you plan to keep focusing on it, or will you move on to making other games?
        MakenCat: We’ll finish Peaceful Mode and then move on to the next game.`
        },
    
        "12.10": {
            zh: `Let’s party like it’s 2023: 那么，其他结局和DLC呢？你们已经放弃这些想法了吗？
        MakenCat: 没有DLC的计划。 | 不过会有另一个好结局。`,
            ru: `Let’s party like it’s 2023: а как же другие концовочки и dlc? уже отвергли эти идеи или как
        MakenCat: в планах dlc небыло никакого | другая хорошая концовка будет`,
            en: `Let’s party like it’s 2023: What about other endings and DLC? Have you already given up on those ideas?
        MakenCat: There were never any plans for DLC. | But there will be another good ending.`
        },
    
        "12.11": {
            zh: `Let’s party like it’s 2023: 你之前不是说过DLC会讲述善良的米塔的故事吗？她留在核心里的剧情？还是我记错了？我已经老了，都256岁了……
        MakenCat: 不，那是发布前的想法。 | 现在我暂时不想继续做 MiSide 了，至少要休息5年。`,
            ru: `Let’s party like it’s 2023: ну ты говорил про длс за добрую Миту вроде, типа она осталась там в ядре, чи я шото путаю, ну я человек уже пожилой, мне 256 года, …
        MakenCat: Нее, это было раньше, до релиза такая идея | Мне пока не хочется <em>MiSide</em> делать дальше потом, нужен отдых от него хотя бы на 5 лет`,
            en: `Let’s party like it’s 2023: Didn't you previously say there'd be DLC about Kind Mita's story—her staying in the core or something? Or am I mixing things up? I'm getting old, already 256 years...
        MakenCat: No, that was an idea before the release. | I don't really want to continue <em>MiSide</em> right now—I need at least a 5-year break.`
        },
    
        "12.12": {
            zh: `Justy: 最好还是直接告诉我们和平模式什么时候出吧
        youmэrai: 等到二六年吧 )))`,
            ru: `Justy: Лучше бы наконец сказал когда мирный режим
        youmэrai: 26 год ждем )))`,
            en: `Justy: You'd better just tell us clearly when Peaceful Mode is coming out.
        youmэrai: Wait until '26 )))`
        },
    
        "12.13": {
            zh: `zigmunt: 谁能看懂啊，卧槽 (附带一张 "她们都在反对你！" 的图片)
        youmэrai: MiSide 还是没被完全理解 | 大家的脑子还没跟上
    
        ！！！图片中的视频《икто не понял Miside》（没人理解Miside），封面的内容在上面的翻译中有，直接搜索就可以在YouTube上找到，视频大致内容讲的是所有米塔其实都串通一气，分成了不同角色其实都是在为了促使玩家进行冒险，最终获得永远不会离开自己的卡带玩家而已，有兴趣可以去看。`,
            ru: `zigmunt: А кто понял бля ("Они ВСЕ против тебя!")
        youmэrai: MiSide не допоняли таки | не догнали умы`,
            en: `zigmunt: Who the hell even understood this? (attached image: "They’re ALL against you!")
        youmэrai: <em>MiSide</em> still wasn’t fully understood. | People’s minds just haven’t caught up.
    
        !!! The referenced image is a thumbnail from a video titled “никто не понял <em>Miside</em>” (“Nobody understood <em>Miside</em>”), which you can find on YouTube. The video proposes a theory that all Mitas are actually working together in different roles to manipulate the player into becoming a loyal cartridge that never leaves.`
        },
    
        "12.14": {
            zh: `Barreometer: 我完全不相信你会和 MakenCat 分道扬镳。这种游戏不可能是由两个不合拍的开发者做出来的。
        youmэrai: 是啊，没人要分开。`,
            ru: `Barreometer: Я вообще не верю, что вы можете с Макеном разойтись. Ну не могло такую игру создать дуо разрабов, которые не подходят друг другу
        youmэrai: Да никто не расходится`,
            en: `Barreometer: I honestly don’t believe you and MakenCat would ever part ways. A game like this couldn’t be made by two devs who don’t click.
        youmэrai: Yeah, no one’s splitting up.`
        },
    
        "12.15": {
            zh: `Rly.: 你好，我有个问题，你们在游戏开发方面有什么经验？能做出这么棒的游戏？你的经验让我很受启发，我现在也很想做游戏…
        youmэrai: Maken 从一一年开始鼓捣，我是从一七-一八年开始的。`,
            ru: `Rly.: Привет, у меня вопрос, какой опыт у вас в разработке игр, что сделали такую чудесную игру? меня вдохновил ваш опыт и я загорелся желанием то…
        youmэrai: Макен тыкает с 11 года, я с 17-18`,
            en: `Rly.: Hi, I’ve got a question—what experience do you have in game development? Making such an amazing game? Your journey inspired me—I want to try making a game too...
        youmэrai: Maken’s been tinkering since 2011. I started around 2017–2018.`
        },
    
        "12.16": {
            zh: `Trojplosnik: 请问，Кепочка（帽子米塔）和 Крутая Мита（酷米塔）是同一个角色还是不同的？这很重要，我和朋友打赌了…
        youmэrai: 不同的。`,
            ru: `Trojplosnik: Скажи пожалуйста, Кепочка и Крутая Мита - это один персонаж или разные? Это очень важно, я с другом поспорил...
        youmэrai: разные`,
            en: `Trojplosnik: Please tell me—are Cap-wearing Mita and Cool Mita the same character or not? It’s important, I’ve got a bet going with a friend…
        youmэrai: They’re different.`
        },
    
        "12.17": {
            zh: `Блин: 酷米塔会像个大肌肉猛男吗？像《Doki Doki Literature Club》里的健身版夏树那个梗一样？
        youmэrai: 假小子（Tomboy）。`,
            ru: `Блин: Крутая Мита будет выглядеть как качок? По типу мема с накачанной Нацуки из ДДЛК
        youmэrai: томбой`,
            en: `Блин: Will Cool Mita look like a jacked muscle girl? Like that buff Natsuki meme from Doki Doki Literature Club?
        youmэrai: Tomboy.`
        },
    
        "12.18": {
            zh: `Дик хренсберг: 我本来想开个玩笑… 但算了。
        youmэrai: tomboy 就是运动系女孩啊。`,
            ru: `Дик хренсберг: Я бы пошутил... но не буду
        youmэrai: дык томбой это девушка на спорте`,
            en: `Дик хренсберг: I was gonna make a joke... but never mind.
        youmэrai: A tomboy is just a sporty girl.`
        },
    
        "12.19": {
            zh: `Pépito: 不对，tomboy 就是反过来的 femboy（伪娘/女装男孩），是个尝试保持男性风格的女孩。
        youmэrai: 别管什么男性风格了，她就是喜欢跑步。
    
        ！！！Pépito的话的意思是，femboy是女装男孩，把字母f倒过来tomboy是假小子，所以假小子就是反过来的女装男孩，也就是男装女孩。`,
            ru: `Pépito: Так не, томбой это фембой но зеркально. Девушка пытается придерживаться мужского стиля
        youmэrai: да ладно мужского, просто любит бегать`,
            en: `Pépito: No no, a tomboy is just a reversed femboy—a girl who adopts a masculine style.
        youmэrai: Forget “masculine,” she just likes running.
    
        !!! What Pépito means is: a femboy is a boy dressing feminine, so if you flip the “f” to a “t” — a tomboy is the opposite: a girl who dresses masculine.`
        },
    
        "12.20": {
            zh: `Trojplosnik: 你在吗？请确认，米塔的假人是会融化并变成血肉骨骼的吗？
        youmэrai: 嗯，我的理解是，原型会被替换成米塔的皮肤（就跟人类一样）。Maken提出，假人会消失（或被吸收掉）。
        
        ！！！youmэrai觉得是原型切换了【外观】，换成了米塔的外观，也就是人类的外观。Makencat提出，里面的原型就【融入了】身体之中。总之，核心思想就是米塔经过传送带之后就跟人类无异。`,
            ru: `Trojplosnik: Ты тут? Подтверди, что у Мит манекены рассасываются и превращаются в мясо с костями
        youmэrai: Ну, прототип заменяется, по моему мнению, на скин Миты (который аля человеческий). Макен предложил так - манекен исчезает (или рассасывается)`,
            en: `Trojplosnik: Are you here? Please confirm—do the mannequins in Mita melt and turn into flesh and bones?
        youmэrai: Yeah, my understanding is that the prototype is replaced with the Mita's skin (like a human). Maken proposed that the mannequin disappears (or gets absorbed).
    
        !!! youmэrai thinks the prototype switches appearance to become Mita’s, basically the human-like appearance. MakenCat proposed that the prototype merges into the body. In the end, the core idea is that Mita comes out of the conveyor belt indistinguishable from a human.`
        },
    
        "12.21": {
            zh: `Параллельная Квинта: 是啊，疯狂米塔的皮肤下居然还留着假人。这导致了一个剧情漏洞，大家已经争论了很多天了。
        youmэrai: 所以她根本就没获得‘皮肤’啊。
    
        ！！！这里的语气非常重要，"и" 在此处不表示 "和"，而是与否定词 "не" 连用构成 "и не" 结构，也就是加强语气的完全否定。再加上 "так" 作为句首语气词，整句话是带有无奈感的强调否定。`,
            ru: `Параллельная Квинта: Да, а у Безумной Миты под кожей почему-то манекен остался. Из-за этого получается сюжетная дыра, о которой спорят уже много дней, на самом деле
        youmэrai: так она скин и не получала`,
            en: `Параллельная Квинта: Yeah, Crazy Mita still has a mannequin underneath her skin. That creates a plot hole, which people have been arguing about for days now.
        youmэrai: It’s not like she ever got a skin in the first place.
    
        !!! Important nuance: the phrase "так она скин и не получала" uses "и не" for emphasis — it doesn’t mean “and not,” but rather a strong “didn’t at all.” The "так" adds an exasperated tone, making it an emphatic denial.`
        },
    
    
        "12.21.5": {
            zh: `🔥堕落秋之梦🔥: 亲爱的开发者，这个生物在变成这样之前是一个玩家吗？如果可以回答这个问题，请@我，谢谢。
        meerai: 是的，这是一个因 bug 而畸变的玩家。
        
        ！！！目前流传有【受 bug 污染的玩家】翻译不准确`,
            ru: `🔥堕落秋之梦🔥: Dear the creators, was it a player before being like this? Please tag me if you can answer this question, thank you.
        meerai: Yeah, it's a glitch-distorted player.`,
            en: `🔥堕落秋之梦🔥: Dear the creators, was it a player before being like this? Please tag me if you can answer this question, thank you.
        meerai: Yeah, it's a glitch-distorted player.
        
        !!! The circulating translation "bug-infected player" is inaccurate.`
          },
        
        "12.22": {
            zh: `FALKE.replica: 当小米塔提到她的第一个朋友时，她指的是那个长得像小丑的怪物吗？长手臂，凶恶的脸——是那个吗？
        youmэrai: 嗯，是的，我们的蜘蛛。`,
            ru: `FALKE.replica: Когда мелкая Мита говорит о первом друге - она имеет в виду то клоунообразное чудище? Длинные руки, злое лицо - оно?
        youmэrai: Ну да, наш паук`,
            en: `FALKE.replica: When Tiny Mita mentions her first friend, is she referring to that clown-like monster? Long arms, scary face — that one?
        youmэrai: Yeah, our spider.`
          },
        
        "12.23": {
            zh: `哲猛: 为什么当善良米塔上楼之后，她身上的衣服和玩家之前设定的不一样？这是 bug 吗？
        youmэrai: 死亡会‘恢复’默认皮肤。`,
            ru: `哲猛: Почему после того, как добрый Мита подошел наверх, одежда тела отличается от одежды, которую установил игрок? Это баг?
        youmэrai: Смерть 'возвращает' обычный скин`,
            en: `哲猛: Why does Kind Mita have a different outfit when she goes upstairs than what the player set earlier? Is that a bug?
        youmэrai: Death “resets” her to the default skin.`
          },
        
        "12.24": {
            zh: `QcCfF: 当善良的米塔被困住时，为什么他在喊主角名字时，声音听起来像是有干扰？
        youmэrai: 这个做法不太成功，我们本来想在所有地方都用干扰音代替名字，但最终决定不这么做。`,
            ru: `QcCfF: Когда добрый Мита был заперт, почему его голос звучал с шумом, когда он звал имя главного героя?
        youmэrai: Неудачный ход получился, подумали, вместо имени везде сделать помехи, но решили так не делать везде.`,
            en: `QcCfF: When Kind Mita was locked up, why did his voice sound distorted when calling out the protagonist’s name?
        youmэrai: That idea didn’t work well. We originally planned to replace the name with static everywhere, but decided not to do it universally.`
          },
        
        "12.25": {
            zh: `Klop: 米塔和假人是有情绪的吗？还是说它们只不过是代码？
        youmэrai: 有的，第一个机器游戏就是关于这个的。说错了，不是第一个，而是第二个。
    
        ！！！第1个游戏是赛车，第2个游戏就是传送带那个游戏。`,
            ru: `Klop: Миты и манекены обладают эмоциями или это просто индивидуальный код для каждой?
        youmэrai: Обладают, первая игра на автомате об этом же. Точнее не первая, а вторая получается.`,
            en: `Klop: Do Mitas and mannequins have emotions? Or are they just individual code for each?
        youmэrai: They do. The first machine game was about this. Actually, it’s not the first, it’s the second.
    
        !!! The first game was a racing game, the second one is the conveyor belt game.`
        },
    
        "12.26": {
            zh: `Klop: 我漏掉了，抱歉。谢谢你的回答。
        youmэrai: 这个假人游戏不能错过，笑死。
    
        ！！！传送带的游戏是游戏流程之中的，根本无法错过。`,
            ru: `Klop: Пропустил ее, сорри. Спасибо за ответ.
        youmэrai: Игру с манекенами не пропустить кек`,
            en: `Klop: I missed it, sorry. Thanks for the answer.
        youmэrai: Can’t miss the mannequin game, LOL.
    
        !!! The conveyor belt game is part of the gameplay and cannot be missed.`
        },
    
        "12.27": {
            zh: `BigMadGasDad (Sleepy): 和平模式会有明确的‘结局’吗？还是说它会是那种可以一直回去玩的模式？
        youmэrai: 它会有一个结局。`,
            ru: `BigMadGasDad (Sleepy): Will peaceful mode have an 'Ending' or will it be like a mode that you can always come back to?
        youmэrai: It will have an ending.`,
            en: `BigMadGasDad (Sleepy): Will Peaceful Mode have an 'Ending' or will it be like a mode that you can always return to?
        youmэrai: It will have an ending.`
        },
    
        "12.28": {
            zh: `ThePhoenix_YZ: 你们不打算做完整的《MiSide 2》，是因为开发第一部让你们精疲力尽了吗？还是有别的原因？
        MakenCat: 做新游戏更有趣，而不是一直困在同一款游戏里。`,
            ru: `ThePhoenix_YZ: Вы не планируете делать полноценную 2ю часть Miside, потому что разработка вас сильно задолбала? Или причина в другом?
        MakenCat: Другую игру делать интереснее, а не на одном зацикливаться.`,
            en: `ThePhoenix_YZ: You don’t plan on doing a full MiSide 2 because the first game drained you? Or is there another reason?
        MakenCat: Making a new game is more fun than staying stuck in one.`
        },
    
        "12.29": {
            zh: `dedhkren: 米塔们之间确实有些不同，比如米拉，她是不是在刻意突出自己？还是说‘疯狂米塔’所说的区别仅仅是发型？
        youmэrai: 米拉在努力超越自我，但她天性还是喜欢胡萝卜。`,
            ru: `dedhkren: Ну Миты вроде друг от друга как-то да отличаются, та же Мила, стараются выделиться, или про это безумная и говорила что 'только прической'?
        youmэrai: Мила на превосмогании, но по природе - она любит морковку.`,
            en: `dedhkren: Mitas do seem different from each other, like Mila—she’s trying to stand out, or is the difference that Crazy Mita spoke about just her hairstyle?
        youmэrai: Mila’s trying to be exceptional, but at heart—she loves carrots.`
        },
    
        // "12.30": {
        //     zh: `Baka: 我有个关于帽子米塔的问题。嗯？为什么她在米塔预览里，脸看起来那么疯狂？
        // youmэrai: 神经+色鬼。`,
        //     ru: `Baka: У меня вопрос про кепку. А? А чё у неё лицо в просмотре мит безумное какое-то?
        // youmэrai: Шиз хорни.`,
        //     en: `Baka: I have a question about Cap-wearing Mita. Hmm? Why does her face look so crazy in the preview?
        // youmэrai: Neurotic + horny.`
        // },
    
        "12.31": {
            zh: `Mirage: 你们已经有新游戏的计划或想法了吗？还是暂时只专注于《MiSide》？
        youmэrai: 有，但我现在懒得搞。`,
            ru: `Mirage: Есть уже планы или идеи для новой игры или пока будете только <em>Miside</em> заниматься?
        youmэrai: Та есть, но мне лень лично щас.`,
            en: `Mirage: Do you already have plans or ideas for a new game, or are you just focusing on <em>Miside</em> for now?
        youmэrai: Yes, but I’m too lazy to work on it right now.`
        },
    
        "12.32": {
            zh: `The Quasar228: 我最近才知道，MiSide 的粉丝正在制作 VR 版。你怎么看这个消息？
        youmэrai: 如果整个游戏都能适配 VR，我会惊讶到张大嘴巴。`,
            ru: `The Quasar228: Я только недавно узнал, что фанаты MiSide делают на VR. Как тебе такая новость?
        youmэrai: Ну если фул игру бы адаптировали, я б открыл рот`,
            en: `The Quasar228: I just found out that MiSide fans are making a VR version. What do you think of this news?
        youmэrai: Well, if they adapt the whole game for VR, I’d be shocked.`
        },
    
        "12.33": {
            zh: `Sonar: 你好，我想问一下，米塔的身高是多少？如果不是秘密的话。
        youmэrai: 定为 1.65（米）。`,
            ru: `Sonar: Здоров, хотел спросить, а какой рост у Миты если не секрет?
        youmэrai: 1.65 решил сделать`,
            en: `Sonar: Hey, I wanted to ask, how tall is Mita, if it's not a secret?
        youmэrai: It was decided on 1.65 meters.`
        },
    
        "12.34": {
            zh: `Mitsuru Kirijio: 你现在具体在为和平模式做什么？
        youmэrai: 我们目前还没做什么，快了。`,
            ru: `Mitsuru Kirijio: А ты что конкретно щас делаешь для мирного режима?
        youmэrai: Для мирного режима мы еще ниче не делаем, скор`,
            en: `Mitsuru Kirijio: What exactly are you working on for Peaceful Mode right now?
        youmэrai: We haven’t done anything yet, but it’s coming soon.`
        },
    
        "12.35": {
            zh: `BURAN GO: 你好！和平模式会是 2D 还是 3D？是说我们一开始要照顾 Q 版米塔，还是说直接进入她的游戏世界？
        MakenCat: 就像游戏开始那样，你可以和米塔一起走动和对话。`,
            ru: `BURAN GO: Привет! Мирный режим будет в 2D или в 3D? Ну типа ухаживать мы будем за чибби митой в начале или уже за митой в её игре?
        MakenCat: Ну как начало игры, когда с Митой можно ходить и разговаривать`,
            en: `BURAN GO: Hello! Will Peaceful Mode be 2D or 3D? Will we take care of Chibi Mita in the beginning, or will we jump straight into her game world?
        MakenCat: Just like the beginning of the game, where you can walk around and talk with Mita.`
        },
    
        "12.36": {
            zh: `GrazyPing.null: 你打算花多少时间来修复 bug？
        MakenCat: 我刚回来，先修 bug 10 天，然后开始做和平模式。游戏本体也会稍微优化，还会加一些不重要的小游戏进去。`,
            ru: `GrazyPing.null: Сколько планируешь времени потратить на исправление багов?
        MakenCat: Ну я вот только вернулся, 10 дней поисправляю и мирный режим начну делать, ещё и сама основная игра немного улучшится, ну типа просто ещё мини игры туда закину не обязательных`,
            en: `GrazyPing.null: How much time do you plan to spend fixing bugs?
        MakenCat: I just got back—I'll fix bugs for about 10 days, then start working on Peaceful Mode. The main game will get some tweaks too, and I’ll add a few optional mini-games.`
        },
    
        "12.37": {
            zh: `CaQing: 你好，尊敬的开发者！ | 我想在这里留言并询问几个关于游戏的问题。 | ①「玩家 1」在现实世界下载的是哪个版本的游戏？ | ②「玩家 1」创建了新的房间和相应的米塔吗？  
        youmэrai: 1.数字不记得。 | 2.没有。`,
            ru: `CaQing: Здравствуйте, уважаемый разработчик! | Я хотел бы оставить здесь сообщение и задать несколько вопросов о игре. | ①Какую версию игры скачал «Игрок 1» в реальном мире? | ②Создал ли «Игрок 1» новую комнату и соответствующего Мита?  
        youmэrai: 1.Не помню цифры | 2.Нет`,
            en: `CaQing: Hello, dear developer! | I’d like to leave a message and ask a couple of questions about the game. | 1) Which version of the game did “Player 1” download in the real world? | 2) Did Player 1 create a new room and corresponding Mita?  
        youmэrai: 1. I don’t remember the number. | 2. No.`
        },
    
        "12.38": {
            zh: `CaQing: 不是1.9？哇，这很有趣。这是否意味着M.K.给玩家1发送了一款无版本号的游戏？
        youmэrai: 最可能是1.9，但玩家进入的不是1.9。
    
        ！！！上个问题我会错意了，没想到这家伙真只是忘了数字而已。`,
            ru: `CaQing: Версия не 1.9? Вау, это очень интересно. Значит ли это, что М.К. отправил «Игроку 1» игру без версии?
        youmэrai: Скорее всего 1.9, но Игрок попал не в 1.9`,
            en: `CaQing: Not 1.9? Wow, that’s interesting. Does that mean M.K. sent Player 1 a versionless build?
        youmэrai: It was probably 1.9, but the player ended up not in 1.9.
    
        !!! I misunderstood the last answer—turns out she really just forgot the number.`
        },
    
        "12.39": {
            zh: `GrazyPing.null: 至少谈谈和平模式吧。
        youmэrai: 和平模式，我大概夏天前能搞定。但说实话，我那部分的工作比Maken少一些，他可以先做些粗略的模型。
    
        ！！！看上去很不合逻辑，为什么是【我的工作少，仍然是他先做模型】，因为youmэrai是画师，在夏天他画完之前，Maken只能先做一些粗略的模型。`,
            ru: `GrazyPing.null: Речь о мирном режиме хотя бы
        youmэrai: До мирного режима, я доберусь к лету. Но справедливости ради - мне там чуть меньше делать, чем Макену, а он может пока черновые модельки сделать`,
            en: `GrazyPing.null: At least say something about Peaceful Mode.
        youmэrai: I’ll get to Peaceful Mode around summer. To be fair, I have less to do than Maken. He can start making rough models in the meantime.
    
        !!! Sounds contradictory—“I have less to do but he starts first”—but that’s because youmэrai is the artist. Until their part is ready in summer, Maken can begin prototyping models.`
        },
    
        "12.40": {
            zh: `CaQing: 明白了，玩家1下载了1.9版本，但由于某种错误进入了1.5版本。这个错误目前不能透露，对吗？还是说这只是一个随机错误？这真的是我最后一个问题了。
        youmэrai: 这是个秘密。`,
            ru: `CaQing: Я понял, Игрок 1 скачал версию 1.9, но из-за какой-то ошибки попал в 1.5. И эту ошибку пока нельзя раскрывать, верно? Или это просто случайная ошибка? Это действительно последний вопрос.
        youmэrai: это секрет`,
            en: `CaQing: Got it—Player 1 downloaded version 1.9, but ended up in 1.5 due to some error. Is that something you can’t reveal yet? Or was it just a random glitch? This is truly my last question.
        youmэrai: It’s a secret.`
        },
    
        "12.41": {
            zh: `南瞳1469: 我只是想问一下，可以吗？Miside 未来会加入中文配音吗？我是中国玩家。
        MakenCat: 我不知道，但那样会不错。中文配音很贵。
    
        ！！！看英文，makencat真的在很尽力把【不会】说的更委婉一点。`,
            ru: `南瞳1469: I just wanted to ask, okay? Will Miside add Chinese dubbing in the future? I am a Chinese player.
        MakenCat: I do not know, but it would be good. Chinese voice acting is expensive.`,
            en: `南瞳1469: I just wanted to ask—will MiSide have Chinese voice acting in the future? I’m a Chinese player.
        MakenCat: I don’t know, but it’d be nice. Chinese dubbing is expensive.
    
        !!! Well, a very polite "no"?`
        },
    
        "12.42": {
            zh: `朽木白安: 问一下，你们在制作《米塔》的原声音乐时是否有合作，还是是 Maken 自己创作的？
        youmэrai: Maken 自己。`,
            ru: `朽木白安: Mогу ли я спросить, сотрудничали ли вы в создании саундтрека к "Мите" или Макен придумал его самостоятельно?
        youmэrai: Макен сам`,
            en: `朽木白安: Can I ask—did you collaborate on Mita’s soundtrack, or was it composed solely by Maken?
        youmэrai: Maken did it himself.`
        },
    
        "12.43": {
            zh: `MangoELLoco: 头儿，我还是没搞明白。在 Steam 上卸载 MiSide 后，进度不会保存吗？我有点搞不清楚了。
        rawumeerai: 进度直接保存在游戏文件夹里。`,
            ru: `MangoELLoco: Шеф, я так и не понял В стиме не сохраняется прогресс Мисайда при его удалении? А то я попал чёт впросак тут
        rawumeerai: прогресс прям в папке игры`,
            en: `MangoELLoco: Boss, I still don’t get it. If you uninstall MiSide from Steam, does your progress get deleted? I’m a little confused.
        rawumeerai: The progress is saved right in the game’s folder.`
        },
    
        "12.44": {
            zh: `Refasa: 请问，你们在做 MiSide 场景时，是完全在 Blender 里做的，还是只做素材，然后在 Unity 引擎中布置的？
        MakenCat: 全部都在 Blender 里做的，然后有一个空对象存放所有副本，这些副本我是后来在 Unity 里布置的。`,
            ru: `Refasa: подскажи, вы когда делали локации в мисайд, вы их делали полностью в блендере, или в нём делали только ассеты, а уже в самом движке юнити расставляли их?
        MakenCat: Всё в блендере делали, потом там был объект пустой в котором хранились все дубликаты, эти дубликаты я уже в Unity расставлял`,
            en: `Refasa: Quick question—were the MiSide locations fully created in Blender, or were assets made there and arranged later in Unity?
        MakenCat: Everything was made in Blender. Then I had an empty object that stored all the copies, and I arranged those in Unity.`
        },
    
        "12.45": {
            zh: `MrsTwinkleRed.blend: 如果比较游戏开发中的办公室工作和远程/自由职业，你更喜欢哪个？哪个让你不太喜欢？
        MakenCat: 我一直是在家里做的。`,
            ru: `MrsTwinkleRed.blend: если сравнивать с офисной работой в геймдеве или удалённой/фрилансером, что тебе больше всего понравилось, а что не особо?
        MakenCat: я всегда дома делал`,
            en: `MrsTwinkleRed.blend: Comparing in-game dev—do you prefer office work or remote/freelance? Which one do you like more or less?
        MakenCat: I’ve always worked from home.`
        },
    
        "12.46": {
            zh: `Kiraeshi: 你好像说过，最难的是做帽子的舞蹈？不过问题可能主要出在动画和音乐上，不是代码的问题。  
        MakenCat: 是的，脚本很好写，在帽子上的问题主要是：动画 - 音乐 - 节奏。`,
            ru: `Kiraeshi: Ты вроде говорил, что самое сложное это танец Кепочки сделать? Хотя, там проблема скорее всего связана с анимацией и музыкой, а не самим кодом.  
        MakenCat: да скрипты изи пишутся, в кепке этой проблемы не было, там: анимация - музыка - тайминги`,
            en: `Kiraeshi: You once said Cap's dance was the hardest part? But the real problem must’ve been the animation and music, not the code itself.  
        MakenCat: Yeah, scripting was easy. The real issue with Kepochka was: animation - music - timing.`
        },
    
        "12.47": {
            zh: `snowly59: 和平模式会是无限的吗？还是可以通关的？需要一定的时间吗？  
        MakenCat: 它不可能做成无限模式。`,
            ru: `snowly59: мирный режим будет бесконечным? Или его можно будет завершить? за определенное кол-во часов?  
        MakenCat: Не получится его сделать бесконечным`,
            en: `snowly59: Will Peaceful Mode be infinite? Or will it be completable within a set time?  
        MakenCat: It won’t be possible to make it infinite.`
        },
    
        "12.48": {
            zh: `Mandoria: 那它会比主线剧情更长吗？  
        MakenCat: 随你喜欢。不过有些东西会永久保存，所以可以不断升级、购买并每次听不同的对话，所有内容都是随机生成的。`,
            ru: `Mandoria: Но он будет дольше чем главный сюжет?  
        MakenCat: Ну как хочешь, так и играй. Но будут вещи, которые навсегда сохраняются, так что прокачивайся, покупай и слушай разные диалоги каждый раз, там всё на рандоме будет построено`,
            en: `Mandoria: Will it be longer than the main story?  
        MakenCat: Play however you like. Some things will be permanently saved—so you can upgrade, buy stuff, and hear different dialogues each time. Everything will be built around randomness.`
        },
    
        "12.49": {
            zh: `Mandoria: 顺便问一下，你能回答这个问题吗？我很好奇疯狂米塔到底是什么？她是个 Bug 吗？病毒？还是某个玩家？  
        我不相信普通的假人能做到这些，或者它们真的有这种能力？  
        rawumeerai: 出于特殊原因而有bug的原型。
    
        ！！！在被蒙皮之前的米塔都叫【原形】  
        ！！！“исключительным образом” 表示“出于某种特殊原因地”，推断此处指“出了特定 bug 的原型”。`,
            ru: `Mandoria: Можешь кстати дать ответ на вопрос? Мне интересно кем на самом деле является БМита, она является багом? Вирусом?или может это какой то игрок? Не верю что обычный манекен способен на такое или может все же они способны?  
        rawumeerai: исключительным образом багованный прототип`,
            en: `Mandoria: Quick question—who is Crazy Mita, really? Is she a bug? A virus? Maybe a player? I don’t believe an ordinary mannequin could do all that—or are they really capable of it?  
        rawumeerai: A uniquely bugged prototype.  
    
        !!! In-game, a “prototype” refers to a Mita before being skinned.
        !!! “исключительным образом” means “due to a specific or special reason” — here it implies a prototype that developed a specific bug.`
        },
    
        "12.50": {
            zh: `Photon.blend: 能分享一下你们是怎么走上现在这条路的吗？比如 Maken 是怎么开始编程的？有没有遇到困难？有没有想过放弃？Umeerai 是怎么开始做 3D 的？以前只画画吗？有没有其他专业背景？  
        MakenCat: 9 岁在 AvaPark 游戏里改了图片，被震撼到，一发不可收拾。先是用 GameMaker 做图形游戏，后转 Unity，最初用 Java，后来换成 C#，文档很清楚，脚本很好写，16–17 岁开始就一直做，现在还很喜欢。  
        MakenCat: 我同时还在 FL Studio、Blender 和画画，后来画图太花时间，大多数模型交给了 Umeerai，其它还是我来做。`,
            ru: `Photon.blend: расскажите ваши истории от том как вы пришли к тому чем вы занимаетесь? В плане как макен стал прогить какие сложности были , были ли желания бросить всё обучение и т.д. так же и умираи, как стал 3дшить, может раньше только хотел рисовать, учился на кого то?  
        MakenCat: В 9 лет в авапар играх поменял картинки и охуел, и пошло поехало, сначала в gamemaker делал игру картинками, потом там unity, сначала там был java, потом его удалили, я перешел на C#, благодаря документациям скрипты пишутся просто, поэтому 16-17 лет сижу и делаю до сих пор, мне нравится  
        MakenCat: С этим же сидел в fl studio и в blender и ещё рисовал, всё сразу и везде, но от того что не успевал рисовать, большинство моделек перешло на umeerai, а всё остальное на мне осталось`,
            en: `Photon.blend: Can you share how you got into this field? Like, how did Maken start programming? Any major struggles or moments of doubt? And what about Umeerai—did they begin with 3D? Were they originally focused on drawing?  
        MakenCat: At age 9, I swapped images in AvaPark games—it blew my mind. After that I was hooked. Started with GameMaker making picture-based games, then moved to Unity. Used Java at first, but when that was removed, I switched to C#. The docs were great, scripting was easy. Been working since I was 16–17. I still love it.  
        MakenCat: At the same time I used FL Studio, Blender, and also drew. Did everything at once, but drawing took too long—so most of the models went to Umeerai, and I handled the rest.`
        },
    
        "12.51": {
            zh: `Aksee: 在新版 FAQ 中说，玩家是在游戏过程中被录制进卡带的，而不是一开始就是卡带。  
        但游戏中有很多和这相冲突的细节……比如：  
        1）白色窗口从一开始就有。  
        2）镜子里的模仿者。  
        3）米塔能模拟整个房间和电脑，如果玩家在游戏开始之前还在现实世界，那太不合理了。  
        4）新游戏时的卡带插入声。  
        5）用手机就能进入游戏世界，结果版本间跳跃却要一堆设备和能量。  
        是不是进入传送门那一刻才开始数字化？毕竟当时显示“数据已传输”。  
        MakenCat: 你完全理解错了，重开吧。  
    
        ！！！“Ну ты маше и мада”是俄语俚语，表示“你搞混了”或“理解错了”，语气轻松。`,
            ru: `Aksee: Я прочитал в новом FAQ ответ на 15 вопрос, что игрок записывается на картридж на протяжении всей игры, а не с самого начала картридж.  
        Но в игре же есть ну очень много противоречий этому...  
        1. Белые окна с самого начала  
        2. Мимик в зеркале  
        3. Возможность Миты создать полную симуляцию  
        4. Звук вставленного картриджа  
        5. Телефон в отличие от телепорта и энергии  
        Как это объяснить?  
        MakenCat: Ну ты маше и мада, всё не так понял значит, переигрывай`,
            en: `Aksee: The new FAQ says the player is recorded to the cartridge over time—not from the very start.  
        But there are tons of contradictions…  
        1. White windows from the very beginning  
        2. The mimic in the mirror  
        3. Mita simulating full rooms and PCs  
        4. The cartridge-insert sound at New Game  
        5. Phone transfer vs version teleport requires massive energy  
        So did digitization begin at the portal moment? It even says “Data transferred.”  
        MakenCat: You totally misunderstood—replay the game.  
    
        !!! “Ну ты маше и мада” is Russian slang meaning “you got it all mixed up” or “you misunderstood everything,” used in a lighthearted, non-serious tone.`
        },
    
        "12.52": {
            zh: `Airis: 米拉会说其他语言吗？  
        rawumeerai: 我想，会的。`,
            ru: `Airis: Мила умела бы говорить на других языках?  
        rawumeerai: Думаю, да`,
            en: `Airis: Would Mila be able to speak other languages?  
        rawumeerai: I think so.`
        },
    
        "12.53": {
            zh: `etakat: [...] 游戏里米拉提到电子宠物（Tamagotchi）是指她带我们进入的游戏吗？ [...] | “愚蠢的 Tamagotchi”这句话该怎么理解？  
        rawumeerai: 很明显，“她说的是那个米塔把我们带进去的游戏”。  
    
        ！！！意思是，米塔游戏就是那个电子宠物游戏。`,
            ru: `etakat: [...] когда мила упоминает в игре тамагочи она говорит про игру в которую нас перенесла мита? [...] | как понимать "Дурацкий Тамагочи"??  
        rawumeerai: ну, очевидно, что "она говорит про игру в которую нас перенесла мита"`,
            en: `etakat: [...] In the game, when Mila mentions “Tamagotchi,” is she talking about the game Mita brought us into? [...] | How do we interpret “stupid Tamagotchi”?  
        rawumeerai: Obviously, she means the game Mita transferred us into.  
    
        !!! So, the “Mita game” is the Tamagotchi-like game being referred to.`
        },
    
        "12.54": {
            zh: `etakat: 在电子宠物游戏中，当米塔用游戏内的提示“送我礼物”请求我们送她礼物时 | 在我们被吸进游戏之前的那段 | 她是在打破第四面墙、以自己的身份和我们说话吗？ | 还是说不该那样，这句台词应该更中性？  
            rawumeerai: 哪怕是“第四面墙”，那也只是游戏里的 | 是对游戏角色而言的
            
            ！！！意思是，没有直接和现实中玩家说话，而是对游戏内角色而言。`,
            ru: `etakat: там где мита просит нас подарить ей подарок внутриигровой подсказкой "Подари мне подарок" | в тамагочи игре до того как нас засосет в игру | она ломает четвертую стену и говорит от своего лица? | или так быть не должно и оно должно звучать нейтрально?  
            rawumeerai: если только "Четвертая стена" внутри игры | для гг типа`,
            en: `etakat: In the Tamagotchi game, when Mita asks us to give her a gift using the in-game hint "Give me a gift" | before we get pulled into the game | is she breaking the fourth wall and speaking as herself? | or is it not supposed to be like that and the line should sound neutral?  
            rawumeerai: Even if it breaks the fourth wall, it's only within the game | and meant for the in-game character.
            
            !!! She’s not speaking directly to the real-world player, only the in-game character.`
        },
    
        "12.55": {
            zh: `Eclipse: 我们在讨论，米塔有胸罩吗？  
        rawumeerai: 没有。`,
            ru: `Eclipse: Мы тут обсуждаем, у Миты есть ли бюстгальтер?  
        rawumeerai: Нет.`,
            en: `Eclipse: We’re discussing—does Mita wear a bra?  
        rawumeerai: No.`
        },
    
        "12.56": {
            zh: `~~ French Mita ~~: @rawumeerai，关于和平模式我有个小问题：|你之前说“目前没有这方面的计划”，是指你们不确定 / 不想加入更多米塔，|还是说这可能未来会考虑呢？  
            rawumeerai: 啥？
            ~~ French Mita ~~: 我的英文不太好，抱歉 XD | 我是想问：你们有没有考虑在和平模式里添加更多米塔？ | 还是说你们不确定，或者不打算添加？  
            rawumeerai: 我们正在考虑中
            
            ！！！提问者的意思是，“目前没有这样的计划”是不是委婉的拒绝，还是说真的日后还有机会，此处umee表示只是还没有想好`,
            ru: `~~ French Mita ~~: @rawumeerai Hey, quick question about the peaceful mod: when you say, "We don't have such a plan at the moment," about adding more Mita's, do you simply mean that you don't know/want, or are you implying that it might eventually be considered?  
            rawumeerai: huh?  
            ~~ French Mita ~~: My english is bad sorry xd | But I mean, are you considering adding more mitas to the peaceful mod, | or are you not sure or don’t want to?  
            rawumeerai: We're considering it`,
            en: `~~ French Mita ~~: @rawumeerai Hey, quick question about the peaceful mod: when you say, "We don't have such a plan at the moment," about adding more Mita's, do you simply mean that you don't know/want, or are you implying that it might eventually be considered?  
            rawumeerai: huh?  
            ~~ French Mita ~~: My english is bad sorry xd | But I mean, are you considering adding more mitas to the peaceful mod, | or are you not sure or don’t want to?  
            rawumeerai: We're considering it
            
            !!! The question was whether “no plans for now” was a soft rejection or open-ended. Umeerai confirms: it’s just undecided.`
        },
    
        "12.57": {
            zh: `venomkat: @rawumeerai 你知道 1.5 版本里那个吓人的米塔叫什么吗？短发米塔提到过的那个。 | 现在她好像被叫做类似“米塔-霸凌”之类的东西。
        rawumeerai: 在游戏里是 “米塔，喜欢欺负和恐吓人” | 这不就是霸凌吗？
        venomkat: 她被用一个词来概括了 | “霸凌米塔” | 太过了吧？
        HeadShoot: 她是“欺负和恐吓”。
        HeadShoot: 那么，“恐吓”是指霸凌，还是只是单纯的吓唬？
        venomkat: 在英语社区内部的一些重新命名建议： | 恶作剧米塔 | 吓人米塔 | 诡异米塔 | 只是想确认“霸凌”是不是最合适的。
        rawumeerai: 啊，对，“欺负”，我也忘了。 | 不过她的确只是吓唬，她只是单纯制造一点点恐怖秀而已。
        HeadShoot: 明白了，谢谢。
        HeadShoot: 所以 umeerai 的意思是更像是吓人，而不是霸凌？
        venomkat: 感谢提供背景资料
    
        ！！！强调的是“吓唬”，并不是霸凌`,
            ru: `venomkat: @rawumeerai не шаришь как называется мита которая пугает из версии 1.5 про которую говорит коротковолосая | сейчас ее называют чем-то вроде мита-травля
        rawumeerai: ну в игре "Мита, которая издевается и запугивает, вроде" | чем не травля
        venomkat: ее провозгласили одним словом | буллинг мита | имба?
        HeadShoot: Ну она "забивает и запугивает"
        HeadShoot: То есть это "запугивать" имеется в виду буллить или всё-таки просто пугать?
        venomkat: предложенные переименования внутри англосообщества: | мита пранкер | мита пугалище | прущущаяся мита | просто поинтересоваться, подходит ли тут больше травля
        rawumeerai: аа, "забивает", я тоже забыл. | Ну, пугает именно что пугает, устраивает хоррор шоу чут-чут
        HeadShoot: Понял, благодарю
        HeadShoot: So umeerai said its more like scaring, not bullying
        venomkat: спасибо за контекст`,
            en: `venomkat: @rawumeerai Do you know what the scary Mita from version 1.5 is called? | The one Short-haired Mita mentioned. | Right now people seem to be calling her something like “Bullying Mita.”  
        rawumeerai: In-game it’s “Mita who likes to bully and intimidate.” | Isn’t that basically bullying?  
        venomkat: They’ve boiled it down to one word | “Bullying Mita” | Bit much, isn’t it?  
        HeadShoot: She’s “bullying and intimidating.”  
        HeadShoot: So is “intimidating” meant as actual bullying, or just plain scaring?  
        venomkat: Here are some alternative name suggestions from the English community: | Prank Mita | Scary Mita | Creepy Mita | Just wondering if “Bullying” is really the best fit.  
        rawumeerai: Ah right, “bully,” I forgot too. | But she really is just scaring, just putting on a little horror show.  
        HeadShoot: Got it, thanks.  
        HeadShoot: So umeerai means it’s more like scaring than bullying?  
        venomkat: Thanks for the context  
        
        !!! Umeerai clarifies it’s more about scaring than actual bullying.`
        },
    
        "12.58": {
            zh: `venomkat: @rawumeerai，当我们在传送带游戏中时，和我们说话的是短发米塔吗，还是只是教程？|因为短发米塔说过：“在游戏机里见我。”  
            rawumeerai: 是的，是她。  
            
            ！！！原句“Встретишь меня в игровом автомате.” 应为“你会在游戏机里见到我。” 而非“在游戏机旁”`,
            ru: `venomkat: @rawumeerai а когда мы в игровом автомате в манекенах с нами говорит коротковолосая или это просто туториал | потому что коротковолосая говорит встреть меня в игровом автомате  
            rawumeerai: да, она`,
            en: `venomkat: @rawumeerai When we’re in the arcade machine, is it Short-haired Mita talking to us, or is it just a tutorial? | Because Short-haired Mita says, “Meet me in the arcade machine.”  
            rawumeerai: Yes, it’s her.  

            !!! The phrase “Встретишь меня в игровом автомате” correctly means “You’ll meet me IN the arcade machine,” not just beside it.`
        },
    
        "12.59": {
            zh: `Sutherex: 你好，不知道是否和 Maken 聊过，但有关于疯狂米塔能力的信息吗？ | 她能生成假人吗？还是说游戏里的假人只会由游戏自动生成，并且在由核心控制的某一个地方？ | （这个信息对澄清背景故事非常重要）  
        rawumeerai: 她不能生成。`,
            ru: `Sutherex: Привет, не знаю пообщался с Макеном или нет, но есть инфа про возможности безумной Миты? | Может ли она спавнить манекены или же манекены в игре создаются только самой игрой и в одном месте контролируемый ядром? | (плз очень нужно для уточнения лора)
        rawumeerai: Не может спавнить`,
            en: `Sutherex: Hi, not sure if you talked to Maken, but is there any info about the abilities of Crazy Mita? | Can she spawn mannequins, or do the mannequins in the game only get created by the game itself, and in one place controlled by the core? | (please, this is really needed for lore clarification)
        rawumeerai: She can’t.`
        },
    
        "12.60": {
            zh: `Airis❀: 米塔有生日吗？  
        umeerai: Maken 好像定在了 8 月 21 日。`,
            ru: `Airis❀: У Миты есть день рождения?  
        umeerai: Макен вроде отмерял на 21 августа`,
            en: `Airis❀: Does Mita have a birthday?  
        umeerai: Maken apparently set it to August 21st.`
        },
    
        "12.61": {
            zh: `Jinsine: @umeerai, 哦，趁着这个机会，我还是想问一下，谁设计了那个可以在不同版本之间穿梭的戒指？因为当我在做它的时候，几乎所有人都问我，为什么戒指上会有一个 F 形的缺口？这个设计有什么特别的意义吗？  
        umeerai: 我只是随手画的，本来是打算改掉的，但最后没来得及修改。  `,
            ru: `Jinsine: @umeerai, о, пользуясь случаем, всё же спрошу, кто рисовал дизайн кольца, которое позволяет ходить через версии, а то пока я его делал, меня решительно все спросили, зачем F-образный вырез, есть ли в нём какой-то свой смысл?)
        umeerai: я прост нафристайлили, вообще планировали менять, но ниче не успели`,
            en: `Jinsine: @umeerai, oh, taking this opportunity, I still want to ask, who designed the ring that allows moving through versions? Because while I was working on it, everyone kept asking me why there’s an F-shaped cut, does it have any special meaning?  
        umeerai: I just freestyle-drew it, we actually planned to change it, but didn’t manage to in time. `
        },
    
        "12.62": {
            zh: `Кактус.Al: 你们是怎么想到要和《战舰世界》搞联动的？
        umeerai: 他们提议，我们同意。`,
            ru: `Кактус.Al: Как вы дошли до того чтобы сделать колабу с миром кораблей?
        meerai: предложили, согласились`,
            en: `Кактус.Al: How did you come up with doing a collab with World of Warships?
        umeerai: They proposed it, we agreed.`
        },

        "12.63": {
            zh: `ABrony.wav: 这是谁提出的想法？当然如果不是秘密的话。
        umeerai: 我做梦都想让我的游戏出现在最棒的现代战舰游戏里。`,
            ru: `ABrony.wav: а чья инициатива то была, кстати, если не секрет?
        umeerai: я спал и видел, как моя игра засветится в лучшей игре современности о боевых кораблях`,
            en: `ABrony.wav: Whose idea was it, by the way—if it’s not a secret?
        umeerai: I dreamed of my game being featured in the best modern warship game.`
        },

        "12.64": {
            zh: `Роман4ик: 社区里的有些人真是吐槽怪，我都惊了。漫画？不喜欢。搞联动？也不要。这单子能一直列下去）
        umeerai: 嗯，这也没什么大不了的，而且我们没花自己的时间，我们已经开始做和平模式了。`,
            ru: `Роман4ик: Какие ж нытики в комьюнити, я фигею. Манга? Не нравится. Коллаба? Неа. Продолжать можно вечно)
        umeerai: Ну, просто ничего страшного, мы же личное время не тратим, мы мирный режим делать начали`,
            en: `Роман4ик: Such whiners in the community, I can't even. A manga? They don't like it. A collab? Nope. The list goes on and on)
        umeerai: Well, it's no big deal. We're not spending our personal time on it, after all; we've started working on peaceful mode.`
        },

        "12.65": {
            zh: `_Sin_dzi_: 和平模式里会有钓鱼和健身房吗？
        umeerai: 我会试着推进钓鱼功能。`,
            ru: `_Sin_dzi_: А в мирном режиме будет рыбалка и зал?
        umeerai: я постараюсь протопить рыбалку`,
            en: `_Sin_dzi_: Will there be fishing and a gym in peaceful mode?
        umeerai: I’ll try to push for fishing.`
        },

        "12.66": {
            zh: `Xeliko: 和平模式有剧情吗，还是说这是一款没有结局的游戏？
        umeerai: 有的。`,
            ru: `Xeliko: у мирного режима есть сюжет или это игра без концовки?
        umeerai: есть`,
            en: `Xeliko: Does peaceful mode have a story, or is it an endless game?
        umeerai: It has one.`
        },

        "12.67": {
            zh: `Печенька Дью: 会有《战地》和 MiSide 的联动吗？
        umeerai: 《战地》不火了。`,
            ru: `Печенька Дью: @umeerai будет коллаба battlefield и miside?
        umeerai: батла не хайп`,
            en: `Pechyenka Dew: Will there be a Battlefield and MiSide collab?
        umeerai: Battlefield isn’t hype anymore.`
        },

        "12.68": {
            zh: `ach: 开发组这是走歪了吧——又是宣布什么莫名其妙的漫画（干嘛？），现在还和《战舰世界》联动（啥玩意儿）。我理解你们需要钱，但不如专注做更新和新项目，不是更好吗？
        umeerai: 你觉得会是我们亲自去做战舰那边的内容，还亲自画漫画吗？`,
            ru: `ach: Чёт разрабов не туда занесло – то непонятную мангу анонсировали (зачем?), сейчас коллабу с миром кораблей (лол что) сделали. Я понимаю, что нужны деньги, но не лучше заняться апдейтами и новыми проектами, не?
        umeerai: ты считаешь, что мы лично для кораблей делаем что-то и мангу сами рисуем?`,
            en: `ach: Devs are kind of off-track—first they announced some weird manga (why?), now they’re doing a collab with World of Warships (lol what). I get that you need money, but wouldn’t focusing on updates and new projects be better?
        umeerai: You think we’re making stuff for the ships ourselves and drawing the manga too?`
        },

        "12.69": {
            zh: `Nabe: 嘿，可以加快开发进度吗？我等不及想玩新版本了！
        umeerai: 我们按照自己的节奏来 | 我们会尽力做的，抱歉啦。但我一定会提醒大家，你们不会错过更新的。`,
            ru: `Nabe: @umeerai hey can you rush the progress? Can’t wait to play the new update
        umeerai: we work at our own pace | We do the best we can, sorry. But I will definitely make everyone ping, you won't miss it`,
            en: `Nabe: @umeerai hey can you rush the progress? Can’t wait to play the new update
        umeerai: we work at our own pace | We do the best we can, sorry. But I will definitely make everyone ping, you won't miss it`,
        }


    }

    
    function setLanguage(lang) {
    document.documentElement.lang = lang;
    for (const [key, value] of Object.entries(translations)) {
    const el = document.getElementById(`translatable-${key}`);
    if (el) {
    el.innerHTML = '';
    el.classList.remove('lang', 'zh', 'en', 'ru');
    const ruContent = (value.ru || "").trim();
    if (ruContent) {
    const ruSpan = document.createElement('span');
    ruSpan.className = 'lang ru';
    ruSpan.lang = 'ru';
    ruSpan.innerHTML = ruContent.replace(/\n/g, '<br>');
    el.appendChild(ruSpan);
    }
    const selectedLangContent = (value[lang] || "").trim();
    if (selectedLangContent && lang !== 'ru') {
    if (ruContent) {
    el.appendChild(document.createElement('br'));
    }
    const langSpan = document.createElement('span');
    langSpan.className = `lang ${lang}`;
    langSpan.lang = lang;
    langSpan.innerHTML = selectedLangContent.replace(/\n/g, '<br>');
    el.appendChild(langSpan);
    }
    el.classList.add('lang');
    }
    }
    // Recalculate heights for open items after language change
    const expandedContents = document.querySelectorAll('.content[style*="max-height"]');
    expandedContents.forEach(content => {
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
    const button = content.previousElementSibling;
    if (button && button.getAttribute('aria-expanded') === 'true') {
    // Use try/catch for safety if elements render unexpectedly slow
    try {
    const currentScrollHeight = content.scrollHeight;
    content.style.maxHeight = currentScrollHeight + "px";
    // Double check shortly after
    setTimeout(() => {
    if (button.getAttribute('aria-expanded') === 'true') {
    content.style.maxHeight = content.scrollHeight + "px";
    }
    }, 300);
    } catch (e) { console.error("Error recalculating height:", e); }
    }
    }
    });

    }