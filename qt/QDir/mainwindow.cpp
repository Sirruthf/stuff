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

    params = new FSParams (this->defaultIni);

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
    delete files;
}

void MainWindow::start()
{
    ui->stackedWidget->setCurrentIndex(0);
    this->files = this->getFileLists(params);
    this->printRows(files, params);
    this->resizeHeader();
}

void MainWindow::printRows (FileTreeList* fileColumns, FSParams* option)
{
    for (int i = 0; i < option->PATHCOUNT; i++)
    {
        QString folder = option->PATHS[i];
        FileTree* column = fileColumns->value(folder);
        FileTree::iterator it = column->begin();

        while (it != column->end())
        {
            RowWidget* row = new RowWidget(option->PATHCOUNT);

            QString text = it.key();
            if (it.value()) continue;

            text.replace(option->BASE_PATH + folder + "/", "");
            row->setLabel(i, text);

            for (int u = i + 1; u < option->PATHCOUNT; u++)
            {
                FileTree* _column = fileColumns->value(option->PATHS[u]);
                FileTree::iterator ahead = _column->find(text);

                if (ahead != _column->end())
                {
                    ahead.value() = true;
                    row->setLabel(u, text);
                }
            }

            content->addWidget(row);
            manager->push(row);

            it++;
        }
    }

    qDebug() << "good here";
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
            _ft->insert(file, false);
        }
    }

    return result;
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
    qDebug() << ui->scrollAreaWidgetContents->height() << ui->scrollAreaWidgetContents->children().size();

    this->titleRow->updateCellGeometry(ui->scrollArea->horizontalScrollBar()->isVisible(),
                                       ui->scrollArea->verticalScrollBar()->isVisible());
}
