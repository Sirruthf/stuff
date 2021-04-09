#include "mainwindow.h"
#include "ui_mainwindow.h"


MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    this->content = new QVBoxLayout;
    this->manager = new RowListManager;

    ui->scrollAreaWidgetContents->setLayout(content);
    ui->scrollAreaWidgetContents->layout()->setSpacing(0);
    ui->stackedWidget->layout()->setSpacing(0);

    this->params = new FSParams (this->defaultIni);
    this->files = nullptr;

    titleRow = new HeaderWidget(params->PATHS, this);
    ui->verticalLayout_2->insertWidget(0, titleRow);

    ui->scrollArea->setStyleSheet("#scrollArea { border: 1px solid gray; border-top: none; }");
    ui->scrollAreaWidgetContents->layout()->setContentsMargins(8, 0, 8, 6);

    QObject::connect(ui->conflictBox, &QAbstractButton::clicked, manager, &RowListManager::conflictClickSlot);
    QObject::connect(titleRow, &HeaderWidget::orderChanged, this, &MainWindow::headerOrderChanged);
    QObject::connect(ui->startButton, &QPushButton::clicked, this, &MainWindow::start);

    this->setupPalette(params);
}

MainWindow::~MainWindow()
{
    delete ui;
    delete manager;
    delete params;

    if (files != nullptr) // closed before the start
        delete files;
}

void MainWindow::printRows (FileTreeList* fileColumns, FSParams* option)
{
    for (int i = 0; i < option->PATHCOUNT; i++)
    {
        FileTree* column = fileColumns->value(option->PATHS[i]);
        if (column->size <= 1) continue;

        FileTree::iterator end = column->end();

        for (auto& it : *column)
        {
            RowWidget* row = new RowWidget(option->PATHCOUNT);
            if (it.node()->neglect) continue;

            row->setLabel(i, it.name());

            for (int u = i + 1; u < option->PATHCOUNT; u++)
            {
                FileTree* column = fileColumns->value(option->PATHS[u]);
                if (column->size <= 1) continue;

                try {
                    FTNode* ahead = column->get(it.path());
                    ahead->neglect = true;
                    row->setLabel(u, it.name());

                } catch (FileTree::NotFoundException) {
//                    qDebug() << "Not found: " << it.name();
                }
            }

            content->addWidget(row);
            manager->push(row);
        }
    }
}

FileTreeList* MainWindow::getFileLists (FSParams* option)
{
    FileTreeList* result = new FileTreeList;

    for (int i = 0; i < option->PATHCOUNT; i++)
    {
        QDirIterator qdi(option->BASE_PATH + option->PATHS[i], QDir::Files, QDirIterator::Subdirectories);

        FileTree* _ft = new FileTree;
        result->insert(option->PATHS[i], _ft);

        while (qdi.hasNext())
        {
            QString file(qdi.next());
            _ft->insert(file.toLower().replace(option->BASE_PATH + option->PATHS[i] + "/", ""));
        }
    }

    return result;
}

void MainWindow::start()
{
    ui->stackedWidget->setCurrentIndex(0);
    this->files = this->getFileLists(params);
    this->printRows(files, params);
    this->resizeHeader();
}

void MainWindow::headerOrderChanged()
{
    this->manager->clear();
    params->PATHS = titleRow->cellNames();
    params->save();
    this->printRows(files, params);
}

void MainWindow::setupPalette (FSParams* ini)
{
    QPalette palette = QGuiApplication::palette();

    palette.setColor(QPalette::Inactive, QPalette::Base, ini->CLR_INACTIVE_BASE);
    palette.setColor(QPalette::Inactive, QPalette::Highlight, ini->CLR_INACTIVE_ACCENT);
    palette.setColor(QPalette::Active, QPalette::Base, ini->CLR_ACTIVE_BASE);
    palette.setColor(QPalette::Active, QPalette::Highlight, ini->CLR_ACTIVE_ACCENT);

    QGuiApplication::setPalette(palette);
}

void MainWindow::resizeEvent (QResizeEvent*)
{
    this->resizeHeader();
}

void MainWindow::resizeHeader()
{
    this->titleRow->updateCellGeometry(ui->scrollArea->horizontalScrollBar()->isVisible(),
                                       ui->scrollArea->verticalScrollBar()->isVisible());
}
